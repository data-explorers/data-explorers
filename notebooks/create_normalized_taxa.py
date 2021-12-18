import pandas as pd


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


def append_df(df):
    # count the number of observations for a taxon_id
    df = add_count_column(df, "observations_count")
    return df


def add_row(row, rank, index):
    temp = {}
    temp["id"] = row["id"]
    temp["taxon_id"] = row[rank + "_id"]
    temp["common_name"] = row[rank + "_common_name"]
    temp["scientific_name"] = row[rank]

    if pd.notna(row["user_login"]):
        temp["user_login"] = row["user_login"]
        temp["image_url"] = row["image_url"]
    else:
        temp["user_login"] = row[rank + "_photo_attribution"]
        temp["image_url"] = row[rank + "_photo_url"]

    temp["rank"] = rank
    temp["taxon_ids"] = ("|").join(row["taxon_ids"].split("|")[0 : index + 1])
    temp["common_names"] = ("|").join(row["common_names"].split("|")[0 : index + 1])
    temp["scientific_names"] = ("|").join(
        row["scientific_names"].split("|")[0 : index + 1]
    )
    return temp


def add_nonmain_row(row):
    temp = {}
    cols = [
        "id",
        "taxon_id",
        "common_name",
        "scientific_name",
        "user_login",
        "image_url",
        "rank",
        "taxon_ids",
        "common_names",
        "scientific_names",
    ]
    for col in cols:
        temp[col] = row[col]
    return temp


def create_taxa_df(df):
    # create a new df with rows for each taxa and eac higher taxa
    new_rows = []
    ranks = ["kingdom", "phylum", "class", "order", "family", "genus", "species"]

    for index, row in df.iterrows():
        for index, rank in enumerate(ranks):
            if pd.isna(row[rank]):
                continue

            temp = add_row(row, rank, index)
            new_rows.append(temp)

        # handle taxa that not one of the main ranks
        if row["taxon_id"] not in [row[rank + "_id"] for rank in ranks]:
            temp = add_nonmain_row(row)
            new_rows.append(temp)

    new_df = pd.DataFrame(new_rows)

    temp = df[["observations_count", "taxon_id"]].drop_duplicates()
    new_df = new_df.merge(temp, how="left")

    new_df.loc[new_df["observations_count"].isna(), "observations_count"] = 0
    new_df["observations_count"] = new_df["observations_count"].astype(int)

    # count the total number of occurences for a taxa including higher taxa
    new_df = add_count_column(new_df, "taxa_count")

    # sort newest observations first so that we get use the photo for the
    # newest observations
    new_df = new_df.sort_values(["id"], ascending=False)
    new_df = new_df.drop_duplicates(subset=["taxon_id"])
    new_df = new_df.sort_values(["observations_count"], ascending=False)

    return new_df
