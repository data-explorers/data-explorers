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

    parent_id = taxon["parent_id"] if taxon["parent_id"] else ""
    obj[f"{rank}_parent_id"] = str(parent_id)
    obj[f"{rank}_ancestor_ids"] = "|".join([str(id) for id in taxon["ancestor_ids"]])
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


def format_inat_data(json_data):
    result = {}

    # handle root taxon

    # the root ancestor_ids does not include taxon_id for current rank;
    # the ancestor_ids in ancestors do include taxon_id for current rank
    json_data["ancestor_ids"] = json_data["ancestor_ids"] + [json_data["id"]]
    result["rank"] = json_data["rank"]
    result["ancestor_ids"] = "|".join([str(id) for id in json_data["ancestor_ids"]])
    add_rank_data(result, json_data["rank"], json_data)



    # handle ancestors
    if 'ancestors' in json_data:
        for taxon in json_data["ancestors"]:
            add_rank_data(result, taxon["rank"], taxon)

    return result
