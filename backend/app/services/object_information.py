from astroquery.simbad import Simbad


simbad = Simbad()
simbad.add_votable_fields("otype")


OBJECT_IDS = {
    "M31 — Andromeda Galaxy": "M31",
    "M42 — Orion Nebula": "M42",
    "Jupiter": "Jupiter",
    "Omega Centauri — NGC 5139": "NGC 5139",
    "M87 — Elliptical Galaxy": "M87",
    "Milky Way Galaxy": "Milky Way",
}


def get_object_information(object_name: str):

    simbad_id = OBJECT_IDS.get(
        object_name,
        object_name
    )

    try:
        result = simbad.query_object(simbad_id)

        if result is None or len(result) == 0:
            return {
                "name": object_name,
                "catalog_id": simbad_id,
                "type": None,
                "ra": None,
                "dec": None,
            }

        row = result[0]

        return {
            "name": str(row["main_id"]),
            "catalog_id": simbad_id,
            "type": str(row["otype"]),
            "ra": float(row["ra"]),
            "dec": float(row["dec"]),
        }

    except Exception:
        return {
            "name": object_name,
            "catalog_id": simbad_id,
            "type": None,
            "ra": None,
            "dec": None,
        }