import { Division, Sum } from "../src/service/SumService";

describe("Sum Service Test", () => {
    it("Should check if the sum is done correctly", () => {
        const result = Sum(1, 2);

        expect(result).toBe(3);
    });

    it("Should check if a division is done correctly", () => {
        const result = Division(10, 5);

        expect(result).toBe(2);
    });

    it("Should generate an error if the divider is zero", () => {
        const result = Division(10, 0);

        expect(result).toStrictEqual(new Error("Operation by zero is not allowed"));

        // expect(() => Division(10, 0)).toThrow("Operation by zero is not allowed");
    });
});
