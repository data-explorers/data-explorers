ranks = ["kingdom", "phylum", "class", "order", "family", "genus", "species"]


def add_rank_data(obj, rank, taxon):
    obj[f"{rank}_id"] = str(taxon["id"])
    if "wikipedia_url" in taxon and taxon["wikipedia_url"]:
        obj[f"{rank}_wikipedia_url"] = taxon["wikipedia_url"]
    else:
        obj[f"{rank}_wikipedia_url"] = ""

    if "iconic_taxon_name" in taxon and taxon["iconic_taxon_name"]:
        obj[f"{rank}_iconic_taxon_name"] = taxon["iconic_taxon_name"]
    else:
        obj[f"{rank}_iconic_taxon_name"] = ""

    if "preferred_common_name" in taxon and taxon["preferred_common_name"]:
        obj[f"{rank}_common_name"] = taxon["preferred_common_name"]
    else:
        obj[f"{rank}_common_name"] = ""

    obj[rank] = taxon["name"]

    add_default_photo(obj, taxon, rank)


def add_default_photo(obj, taxon, rank=False):
    if "default_photo" in taxon and taxon["default_photo"]:
        photo = taxon["default_photo"]

        field = f"{rank}_photo_url" if rank else "photo_url"
        if "medium_url" in photo and photo["medium_url"]:
            obj[field] = photo["medium_url"]
        else:
            obj[field] = photo["original_url"]

        field = f"{rank}_photo_attribution" if rank else "photo_attribution"
        if "attribution" in photo and photo["attribution"]:
            obj[field] = photo["attribution"]
        else:
            obj[field] = ""

        field = f"{rank}_photo_license_code" if rank else "photo_license_code"
        if "license_code" in photo and photo["license_code"]:
            obj[field] = photo["license_code"]
        else:
            obj[field] = ""


def process_inat_data(json_data):

    result = {}
    if "rank" in json_data and json_data["rank"]:
        result["rank"] = json_data["rank"]
        add_rank_data(result, json_data["rank"], json_data)

    for taxon in json_data["ancestors"]:
        if taxon["rank"] == "kingdom":
            add_rank_data(result, "kingdom", taxon)
        elif taxon["rank"] == "phylum":
            add_rank_data(result, "phylum", taxon)
        elif taxon["rank"] == "class":
            add_rank_data(result, "class", taxon)
        elif taxon["rank"] == "order":
            add_rank_data(result, "order", taxon)
        elif taxon["rank"] == "family":
            add_rank_data(result, "family", taxon)
        elif taxon["rank"] == "genus":
            add_rank_data(result, "genus", taxon)
        elif taxon["rank"] == "species":
            add_rank_data(result, "species", taxon)

    if "ancestor_ids" in json_data and json_data["ancestor_ids"]:
        result["ancestor_ids"] = ",".join([str(id) for id in json_data["ancestor_ids"]])
        
    result['parent_id'] = json_data['parent_id']

    return result


def add_concatenated_columns(inat_df):
    inat_df["taxon_ids"] = (
        inat_df["kingdom_id"]
        + "|"
        + inat_df["phylum_id"]
        + "|"
        + inat_df["class_id"]
        + "|"
        + inat_df["order_id"]
        + "|"
        + inat_df["family_id"]
        + "|"
        + inat_df["genus_id"]
        + "|"
        + inat_df["species_id"]
    )

    inat_df["scientific_names"] = (
        inat_df["kingdom"]
        + "|"
        + inat_df["phylum"]
        + "|"
        + inat_df["class"]
        + "|"
        + inat_df["order"]
        + "|"
        + inat_df["family"]
        + "|"
        + inat_df["genus"]
        + "|"
        + inat_df["species"]
    )

    inat_df["common_names"] = (
        inat_df["kingdom_common_name"]
        + "|"
        + inat_df["phylum_common_name"]
        + "|"
        + inat_df["class_common_name"]
        + "|"
        + inat_df["order_common_name"]
        + "|"
        + inat_df["family_common_name"]
        + "|"
        + inat_df["genus_common_name"]
        + "|"
        + inat_df["species_common_name"]
    )

    inat_df.loc[inat_df["rank"].isin(ranks) == False, "common_names"] = (
        inat_df["common_names"] + "|" + inat_df["common_name"]
    )

    inat_df.loc[inat_df["rank"].isin(ranks) == False, "scientific_names"] = (
        inat_df["scientific_names"] + "|" + inat_df["scientific_name"]
    )

    inat_df.loc[inat_df["rank"].isin(ranks) == False, "taxon_ids"] = (
        inat_df["taxon_ids"] + "|" + inat_df["taxon_id"]
    )
