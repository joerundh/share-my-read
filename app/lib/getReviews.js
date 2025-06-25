export default async bookId => {
    if (!bookId) {
        return null;
    }
    const res = await fetch(`/api/reviews`, {
        header: {
            method: "GET"
        },
        body: {
            bookId: bookId
        }
    });
    if (!res.ok) {
        throw new Error("Could not fetch data.")
    }
    const obj = await res.json();
    if (!obj.results.length) {
        return [];
    }
    return obj.results;
}