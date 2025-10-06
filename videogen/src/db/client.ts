import { DbRow, DbRowResult } from "./types";
import { data } from "./data";

export class DbClient {
    /**
     * Assume this is making a call to an external library
     * that cannot be changed.
     */
    private async processRow(row: unknown): Promise<DbRowResult> {
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

        if (
            typeof row === "object" &&
            row != null &&
            "id" in row &&
            "text" in row &&
            "timing" in row
        ) {
            const { id, text, timing } = row;

            if (typeof id !== "string" || typeof text !== "string" || typeof timing !== "string") {
                throw new Error("Invalid db row");
            }

            return {
                result: {
                    id,
                    text,
                    timing,
                },
                accessTime: Date.now(),
            };
        }

        throw new Error("Invalid db row");
    }

    public async getAllRows(): Promise<DbRowResult[]> {
        const rowResults: DbRowResult[] = [];

        await Promise.all(data.map(async (row) => {
            /**
             * Assume that you have to call processRow here.
             */
            rowResults.push(await this.processRow(row));
        }));

        return rowResults;
    }

    public async getRow(id: string): Promise<DbRowResult | undefined> {
        const rows = await this.getAllRows();

        return rows.find(row => row.result.id === id);
    }

    public async updateRow(id: string, newRow: Partial<DbRow>): Promise<DbRowResult | undefined> {
        const rows = await this.getAllRows();
        const index = data.findIndex(row => typeof row === "object" && row != null && "id" in row && row.id === id);
        
        if (index === -1) return undefined;

        /**
         * Assume that you have to call processRow here.
         */
        const rowResult = await this.processRow({
            ...rows[index].result,
            ...newRow,
        });

        data[index] = rowResult.result;

        return rowResult;
    }
}