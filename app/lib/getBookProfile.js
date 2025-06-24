export default async bookId => {
    if (!bookId) {
        throw new Error("No book ID provided.")
    }
    const res = await fetch(`https://gutendex.com/books?ids=${bookId}`);
    if (!res.ok) {
        throw new Error("Could not fetch data.");
    }
    const obj = await res.json();
    if (!obj.results.length) {
        return null;
    }
    return obj.results[0];
}