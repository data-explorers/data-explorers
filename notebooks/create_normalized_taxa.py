import pandas as pd
import numpy as np

main_ranks = ["kingdom", "phylum", "class", "order", "family", "genus", "species"]

# https://en.wikipedia.org/wiki/Taxonomic_rank
all_ranks = [
    "stateofmatter",
    "kingdom",
    "phylum",
    "subphylum",
    "class",
    "subclass",
    "infraclass",
    "subterclass",
    "superorder",
    "order",
    "suborder",
    "infraorder",
    "zoosection",
    "zoosubsection",
    "superfamily",
    "epifamily",
    "family",
    "subfamily",
    "tribe",
    "subtribe",
    "genus",
    "subgenus",
    "section",
    "complex",
    "species",
    "subspecies",
    "variety",
    "hybrid",
]

# =====================
# create taxa file for each project
# =====================


def add_count_column(df, count_col):
    # count the number of taxon_id
    temp = df.copy()
    temp["temp_count"] = 1
    temp["temp_count"] = temp["temp_count"].astype(int)

    # create a df with 2 columns: taxon_id and temp_count
    count_df = temp.groupby(["taxon_id"])["temp_count"].sum().reset_index()
    count_df.rename(columns={"temp_count": count_col}, inplace=True)

    df = df.merge(count_df)
    return df

def create_taxa_base_df(df, append_taxon_method):
    # create records for the observed taxon and derived higher levels
    new_rows = []
    # create taxa records for each obersavations
    for index, row in df.iterrows():
        # make sure the taxa ranks are in the correct order
        row_ranks = get_row_ranks(row, all_ranks, "ancestor_ids", "taxon_id")
        # limit the ranks to the main ranks and rank of the observation
        allowed_ranks = main_ranks + [row["rank"]]
        rank_history = []

        for rank in row_ranks:
            if rank in allowed_ranks:
                rank_history.append(rank)
                taxon = create_taxon(row, rank, rank_history)
                append_taxon_method(taxon, row, rank)

                new_rows.append(taxon)

    new_df = pd.DataFrame(new_rows)
    # count the total number of occurences for a taxa including higher taxa
    new_df = add_count_column(new_df, "taxa_count")

    # sort taxa records by observations_count and id so we can use photos
    # from the newest observations.
    new_df = new_df.sort_values(['taxon_id', 'observations_count', "id"], ascending=False)
    new_df = new_df.drop_duplicates(subset=["taxon_id"])
    new_df = new_df.sort_values(["observations_count"], ascending=False)

    return new_df


def append_taxon(taxon, row, rank):
    taxon["id"] = row["id"]
    taxon["user_login"] = row["user_login"]
    taxon["image_url"] = row["image_url"]

    if rank == row["rank"]:
        taxon["observations_count"] = row["observations_count"]
    else:
        taxon["observations_count"] = 0


def create_taxa_df(df):
    return create_taxa_base_df(df, append_taxon)


def append_taxon_la(taxon, row, rank):
    taxon["id"] = row["id"]
    taxon["user_login"] = row["user_login"]
    taxon["image_url"] = row["image_url"]

    if rank == row["rank"]:
        taxon["observations_count"] = row["observations_count"]
        taxon["taxon_group"] = row["taxon_group"]
        taxon["type"] = row["type"]
    else:
        taxon["observations_count"] = 0
        taxon["taxon_group"] = np.nan
        taxon["type"] = np.nan


def create_taxa_la_df(df):
    return create_taxa_base_df(df, append_taxon_la)


# =====================
# create taxa file all projects
# =====================


def get_row_ranks(row, all_ranks, ancestor_col, id_col):
    # use ancestor_ids to set the order of the ranks
    ids = row[ancestor_col].split("|")
    ids.append(row[id_col])

    temp = {}
    for rank in all_ranks:
        if rank in row and pd.notna(row[rank]):
            temp[ids.index(row[rank + "_id"])] = rank

    # sort the ranks
    return [val for key, val in sorted(temp.items(), key=lambda ele: ele[0])]


def create_taxon(row, rank, rank_history):
    taxon = {}
    taxon["taxon_id"] = row[rank + "_id"]
    taxon["common_name"] = row[rank + "_common_name"]
    taxon["scientific_name"] = row[rank]
    taxon["rank"] = rank
    # since we don't use all the iNaturalist ranks, use the previous rank
    # instead of the parent_id from iNaturalist to get parent_id
    if len(rank_history) > 1:
        taxon["parent_id"] = row[rank_history[-2] + "_id"]
    # use iNaturalist parent_id if there is only one rank
    else:
        taxon["parent_id"] = row[rank + "_parent_id"]

    ids = []
    names = []
    common_names = []
    for rank in rank_history:
        ids.append(row[rank + "_id"])
        names.append(row[rank])
        common_name = (
            row[rank + "_common_name"] if pd.notna(row[rank + "_common_name"]) else ''
        )
        common_names.append(common_name)

    taxon["taxon_ids"] = "|".join(ids)
    taxon["common_names"] = "|".join(common_names)
    taxon["scientific_names"] = "|".join(names)

    return taxon
