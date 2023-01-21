import Dexie from "dexie";

class Database extends Dexie {
	constructor() {
		super("database");
		this.version(1).stores({
			tracks: "&id, spotifyId", // Primary key
		});
	}
}

export const db = new Database();
