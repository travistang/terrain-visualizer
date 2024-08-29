import GpxParser from "gpxparser";

export const getGPXWayPointsFromBlob = async (blob: Blob) => {
    const gpx = new GpxParser();
    gpx.parse(await blob.text());
    debugger;
    return gpx.tracks[0] || null;
}