inat_names_cols =['taxon_id', 'scientific_names', 'common_names', 'taxon_ids']
inat_names_df = pd.read_csv(all_taxa, dtype=str, usecols=inat_names_cols)
inat_names_df['taxon_id'] = inat_names_df['taxon_id'].astype(int)
inat_names_df = inat_names_df.fillna('')
log_df(inat_names_df)


taxa_cols = [ 
    'scientific_name', 
    'common_name',
    'taxon_id', 
    'iconic_taxon_name', 
    'taxon_kingdom_name',
    'taxon_phylum_name',
    'taxon_class_name', 
    'taxon_order_name',
    'taxon_family_name', 
    'taxon_genus_name', 
    'taxon_species_name',
]
basic_taxa_cols = ['scientific_name', 'common_name', 'taxon_id']

basic_cols = basic_taxa_cols + ['image_url', 'user_login']
cols = taxa_cols + ['image_url', 'user_login']



def create_taxa_df_v1(df):
    df['taxon_id'] = df['taxon_id'].astype(int)
    
    df['is_species'] = df['taxon_species_name'].notna()
    adjust_is_species_for_higher_ranks_v1(df)    

    temp = df.copy()
    temp['temp_count'] = 1
    temp['temp_count'] = temp['temp_count'].astype(int)

    # create a df with 2 columns: taxon_id and temp_count       
    count_df = temp.groupby(['taxon_id'])['temp_count'].sum().reset_index()
    count_df.rename(columns={"temp_count": "count"}, inplace=True)


    df = df.drop_duplicates(subset=['taxon_id'])
    df = df.merge(count_df)
    df = df.sort_values('count', ascending=False)
    
    return df


def adjust_is_species_for_higher_ranks_v1(df):
    adjust_is_species_for_rank_v1(df, 'taxon_genus_name')    
    adjust_is_species_for_rank_v1(df, 'taxon_family_name')   
    adjust_is_species_for_rank_v1(df, 'taxon_order_name')  
    adjust_is_species_for_rank_v1(df, 'taxon_class_name')  
    adjust_is_species_for_rank_v1(df, 'taxon_phylum_name')    
    adjust_is_species_for_rank_v1(df, 'taxon_kingdom_name') 
    df.loc[df['scientific_name'].str.contains(' × ') == True, 'is_species'] = True

def adjust_is_species_for_rank_v1(df, rank):
    tmp = df.copy()
    taxa = list(df[df['is_species'] == True][rank].unique())
    tmp = tmp[(tmp['is_species'] == False) & (tmp[rank].notna())]
    for index, row in tmp[~ tmp[rank].isin(taxa)].iterrows():
        df.at[index, 'is_species'] = True
        

for dir_path in Path().glob('../data/**/'):
    if dir_path.name != 'data':
        dfs = []
        for file_path in  Path().glob('../data/' +  dir_path.name + '/observations-*.csv'  ):
            df = pd.read_csv(file_path,  usecols=cols)
            df = df.dropna(subset=['taxon_id'])
            df['taxon_id'] = df['taxon_id'].astype(int)
            df = df.merge(inat_names_df, on="taxon_id", how="left")

                
            dfs.append(df)

        combine_df = pd.concat(dfs)
        taxa_df = create_taxa_df_v1(combine_df)

        taxa_list_path = Path('..', 'data',  dir_path.name, 'taxa_list_v1.csv' )
        taxa_df.to_csv(taxa_list_path, index=False)

        new_path = Path('..','app', 'src', 'lib', 'data') /dir_path.name
        new_path.mkdir(parents=True, exist_ok=True)
        basic_df = taxa_df[basic_cols + ['count', 'is_species', 'taxon_ids', 'scientific_names', 'common_names']]
        basic_df.to_json(new_path/ "taxa_v1.json", orient = "records")