/**
 * Deterministic Infinite Location Engine
 * Designed for infinite scale with O(1) computation per record.
 * This is a mathematical replacement for traditional city databases.
 */

export interface VirtualLocation {
    id: string;
    label: string;
    rank: number;
    popularity: number;
    metadata: {
        type: string;
        level: string;
    };
}

const ONSETS = ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "Z", "Ch", "Sh", "Ph", "Tr", "St", "Kr", "Gl"];
const NUCLEI = ["a", "e", "i", "o", "u", "ia", "ee", "oo", "ou", "y", "ae"];
const CODAS = ["ck", "d", "g", "l", "m", "n", "p", "r", "s", "t", "v", "th", "sh", "nt", "rd", "st"];

export class LocationEngine {
    /**
     * Produces a stable 32-bit unsigned hash from a string.
     */
    static hashString(str: string): number {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    /**
     * Mathematical PRNG (Linear Congruential Generator)
     */
    static createPRNG(seed: number) {
        let state = seed % 2147483647;
        if (state <= 0) state += 2147483646;

        return () => {
            state = (state * 48271) % 2147483647;
            return (state - 1) / 2147483646;
        };
    }

    /**
     * Generates a realistic-sounding city name from a numeric seed.
     */
    static generateName(seed: number): string {
        const rng = this.createPRNG(seed);
        const syllables = Math.floor(rng() * 2) + 2; // 2-3 syllables
        let name = "";

        for (let i = 0; i < syllables; i++) {
            name += ONSETS[Math.floor(rng() * ONSETS.length)];
            name += NUCLEI[Math.floor(rng() * NUCLEI.length)];
            if (rng() > 0.4) name += CODAS[Math.floor(rng() * CODAS.length)];
        }

        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    /**
     * Generates a batch of virtual locations for a given state.
     */
    static getVirtualLocations(
        path: string, // "Continent|Country|State"
        offset: number = 0,
        limit: number = 50
    ): VirtualLocation[] {
        const pathHash = this.hashString(path);
        const locations: VirtualLocation[] = [];

        for (let i = 0; i < limit; i++) {
            const index = offset + i;
            // Unique seed for this specific location index
            const itemSeed = this.hashString(`${path}|${index}`);
            const rng = this.createPRNG(itemSeed);

            const name = this.generateName(itemSeed);
            const populationRank = Math.floor(rng() * 1000000) + 1;
            const popularity = Number((rng() * 0.95 + 0.05).toFixed(3));

            locations.push({
                id: `vloc_${this.hashString(name + itemSeed).toString(36)}`,
                label: name,
                rank: populationRank,
                popularity: popularity,
                metadata: {
                    type: "City",
                    level: "Virtual"
                }
            });
        }

        return locations;
    }

    /**
     * Validates if a generated ID matches its parameters.
     */
    static verifyLocation(id: string, path: string, index: number): boolean {
        const batch = this.getVirtualLocations(path, index, 1);
        return batch[0].id === id;
    }
}
