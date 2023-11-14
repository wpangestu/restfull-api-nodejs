import {
    createTesAddress,
    createTestContact,
    createTestUser, getAddress, getTestContact,
    removeAllAddress,
    removeAllTestContact,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";

describe("POST /api/contact/:contactId/address", function (){
    beforeEach(async ()=>{
        await createTestUser();
        await createTestContact();
    });

    afterEach(async ()=>{
        await removeAllAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should be can insert address', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .post("/api/contacts/"+contact.id+"/address")
            .set("Authorization","test")
            .send({
                street:"test street",
                city:"test city",
                province:"jawa tengah",
                country:"indonesia",
                postal_code:"313133",
                contact_id:contact.id
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("test street");
        expect(result.body.data.city).toBe("test city");
        expect(result.body.data.province).toBe("jawa tengah");
        expect(result.body.data.country).toBe("indonesia");
        expect(result.body.data.postal_code).toBe("313133");
    });

    it('should be reject when validate false', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .post("/api/contacts/"+contact.id+"/address")
            .set("Authorization","test")
            .send({
                street:"test street",
                city:"test city",
                province:"jawa tengah",
                country:"",
                postal_code:"313133",
                contact_id:contact.id
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contact/:contactId/address/:addressId", function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTesAddress();
    });

    afterEach(async () => {
        await removeAllAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should be get address", async ()=>{
        const contact = await getTestContact();
        const address = await getAddress();
        const result = await supertest(web)
            .get("/api/contacts/"+contact.id+"/address/"+address.id)
            .set("Authorization","test");

            expect(result.status).toBe(200);
            expect(result.body.data.id).toBe(address.id);
            expect(result.body.data.street).toBe("street test");
            expect(result.body.data.city).toBe("city test");
            expect(result.body.data.postal_code).toBe("12345");
            expect(result.body.data.province).toBe("jawa");
            expect(result.body.data.country).toBe("indo");
    });

    it("should be cannot get address wrong contact id", async ()=>{
        const contact = await getTestContact();
        const address = await getAddress();
        const result = await supertest(web)
            .get("/api/contacts/"+(contact.id+1)+"/address/"+address.id)
            .set("Authorization","test");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()
    });

    it("should be cannot get address, wrong address id", async ()=>{
        const contact = await getTestContact();
        const address = await getAddress();
        const result = await supertest(web)
            .get("/api/contacts/"+(contact.id)+"/address/"+(address.id+10))
            .set("Authorization","test");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()
    });

});