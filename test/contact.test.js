import {
    createManyTestContacts,
    createTestContact,
    createTestUser,
    getTestContact,
    removeAllTestContact,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";

describe("POST /api/contact", function (){

    beforeEach(async ()=>{
        await createTestUser();
    });

    afterEach(async ()=>{
       await removeAllTestContact();
       await removeTestUser();
    });

    it("it should can create contact", async ()=>{
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization","test")
            .send({
                first_name:"test",
                last_name:"test",
                email:"test@testmail.com",
                phone:"084123123123"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@testmail.com");
        expect(result.body.data.phone).toBe("084123123123");

    });

    it("it should rejected create contact", async ()=>{
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization","test")
            .send({
                first_name:"",
                last_name:"test",
                email:"test@testmail.com",
                phone:"0841231231233123131231312312312312312312312312313123123"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contact/contactId", function (){
    beforeEach(async ()=>{
        await createTestUser();
        await createTestContact();
    });

    afterEach(async ()=>{
        await removeAllTestContact();
        await removeTestUser();
    })

    it("should can get contact", async ()=>{
        const contact = await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/"+contact.id)
            .set("Authorization","test");

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@fakeemail.com");
        expect(result.body.data.phone).toBe("6285229222111");
    })

    it("should return 404 if contact id not found", async ()=>{
        const contact = await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/"+(contact.id+1))
            .set("Authorization","test");

        expect(result.status).toBe(404);
    })
});

describe("PUT /api/contacts/contactId",function () {
    beforeEach(async ()=>{
        await createTestUser();
        await createTestContact();
    });

    afterEach(async ()=>{
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can update contact', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .put("/api/contacts/"+contact.id)
            .set("Authorization","test")
            .send({
                first_name:"test2",
                last_name:"test2",
                email:"test@testmail2.com",
                phone:"0852222222"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contact.id);
        expect(result.body.data.first_name).toBe("test2");
        expect(result.body.data.last_name).toBe("test2");
        expect(result.body.data.email).toBe("test@testmail2.com");
        expect(result.body.data.phone).toBe("0852222222");
    });

    it('should reject update contact', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .put("/api/contacts/"+contact.id)
            .set("Authorization","test")
            .send({
                first_name:"",
                last_name:"",
                email:"testtestmailcom",
                phone:"08522222223213131313"
            });

        expect(result.status).toBe(400);
    });

    it('should reject update contact if contact is not found', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .put("/api/contacts/"+(contact.id+1))
            .set("Authorization","test")
            .send({
                first_name:"test2",
                last_name:"test2",
                email:"test@testmail2.com",
                phone:"0852222222"
            });
        expect(result.status).toBe(404);
    });
});

describe("DELETE /api/contact/:contactId",function (){
    beforeEach(async ()=>{
        await createTestUser();
        await createTestContact();
    });

    afterEach(async ()=>{
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can delete contact', async () => {
        let contact = await getTestContact();
        const result = await supertest(web)
            .delete("/api/contacts/"+contact.id)
            .set("Authorization","test");

        expect(result.status).toBe(200);

        contact = await getTestContact();
        expect(contact).toBeNull();
    });

    it('should reject delete contact', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .delete("/api/contacts/"+(contact.id+1))
            .set("Authorization","test");

        expect(result.status).toBe(404);
    });
});

describe("GET /api/contacts/", function (){
    beforeEach(async ()=>{
        await createTestUser();
        await createManyTestContacts();
    });

    afterEach(async ()=>{
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization","test");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({
                page:2
            })
            .set("Authorization","test");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search using name', async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({
                name:"test 1"
            })
            .set("Authorization","test");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using email', async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({
                email:"test1"
            })
            .set("Authorization","test");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using phone', async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .query({
                phone:"6285229222111"
            })
            .set("Authorization","test");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

});