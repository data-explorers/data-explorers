import time
import numpy as np
import requests

def fetchGlobi(taxon_name, interaction):
    time.sleep(0.25)
    apiBase = 'https://api.globalbioticinteractions.org/taxon'
    url = f'{apiBase}/{taxon_name}/{interaction}'
    # print(url)
    
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        if len(json_data['data']) > 0:
            return json_data['data'][0][2]

            
def fetchiNat(taxon_name):
    if taxon_name.startswith('BOLD:'):
        return
    if taxon_name.startswith('ORN.'):
        return
    if taxon_name.startswith('http'):
        return
    if taxon_name.startswith('various'):
        return
    if taxon_name.startswith('secretions'):
        return

    
    time.sleep(0.25)
    url = f'https://api.inaturalist.org/v1/taxa?q={taxon_name}'
    # print(url)
    
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        if len(json_data['results']) > 0:
            result =json_data['results'][0]
            data = {
                'scientific_name': result['name'], 
                'taxon_id': result['id'], 
            }
            if 'preferred_common_name' in result:
                data['common_name'] =  result['preferred_common_name']
            else:
                data['common_name'] = ''
            return data

            
            
def formatInteractions(taxa_df, row, interaction, interactionLimit = 3): 
    interactions = []
    not_found_names = []
    count = 0
    search_cache = {}
    
    # connect to Globi api    
    names = fetchGlobi(row['scientific_name'], interaction)
    if not names:
        return
    
    
    # look for Globi taxon name in the existing taxa dataframe     
    for name in names:
        search_results = taxa_df[taxa_df['scientific_name'] == name]
        if len(search_results) > 0:
            interaction_results = {
                'subject_taxon_id': row['taxon_id'],
                'subject_common_name': row['common_name'],
                'subject_scientific_name': row['scientific_name'],

                'target_scientific_name': name, 
                'target_common_name': search_results['common_name'].values[0],
                'target_taxon_id': search_results['taxon_id'].values[0],
                'interaction': interaction,
            }
            interactions.append(interaction_results)
            count += 1
        else:
            not_found_names.append(name)
            
    for name in not_found_names:
        if count < interactionLimit:
            interaction_results = {
                'subject_taxon_id': row['taxon_id'],
                'subject_common_name': row['common_name'],
                'subject_scientific_name': row['scientific_name'],

                'target_scientific_name': name, 
                'target_common_name': np.nan,
                'target_taxon_id': np.nan,
                'interaction': interaction,
            }
            interactions.append(interaction_results)

            count += 1
            
    return interactions

    