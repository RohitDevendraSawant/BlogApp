import { test, expect } from '@playwright/test';
import "dotenv/config";
import  jwt  from 'jsonwebtoken';


test.describe.serial("Blog App testing", ()=>{
  let refreshToken;
  let accessToken;
  let blogID;
  test.describe.serial("User", ()=>{
    const baseURL = "http://localhost:5000/api/user";
  
    test("Register new user", async ({ request })=>{
      console.log("here");
      const res = await request.post(`${baseURL}/signup`, {data: {
        "fname": "Rohit",
        "lname": "Sawant",
        "email": "user3@gmail.com",
        "password": "123456",
        "confirmPassword": "123456"
      }});
      expect(res.status()).toBe(201);
    });
  
    test("Registering with invalid data", async ({ request })=>{
      const res = await request.post(`${baseURL}/signup`, {data: {
        "fname": "Rohit1",
        "lname": "",
        "email": "user4@gmail.com",
        "password": "123456",
        "confirmPassword": "123456"
      }});
      const responseData = await res.json();
      expect(res.status()).toBe(400);
      expect(responseData.message).toBe("Incorrect Data");
    });
  
    test("Registering same user", async ({ request })=>{
      const res = await request.post(`${baseURL}/signup`, {data: {
        "fname": "Rohit",
        "lname": "Sawant",
        "email": "user1@gmail.com",
        "password": "123456",
        "confirmPassword": "123456"
      }});
      const responseData = await res.json();
      expect(res.status()).toBe(400);
      expect(responseData.message).toBe("User with this email already exist.");
    });
  
    test("Login user", async ({ request })=>{
      const res = await request.post(`${baseURL}/login`, {data: {
        "email": "user1@gmail.com",
        "password": "123456",
      }});
      const responseData = await res.json();
      expect(res.status()).toBe(200);
      console.log(responseData);
      refreshToken = responseData.refreshToken;
      console.log(refreshToken);
    });
  
    test("Getting access token", async ({ request })=>{
      console.log(refreshToken);
      const res = await request.post(`${baseURL}/getAccessToken`, {data: {
        "refreshToken": refreshToken
      }});
      const responseData = await res.json();
      console.log(responseData);
      expect(res.status()).toBe(200);
      accessToken = responseData.accessToken;
    });
  
    test("Entering invalid refresh token", async ({ request })=>{
      const res = await request.post(`${baseURL}/getAccessToken`, {data: {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjIyOGYzZmFhNzA5MDczYzkzMzdjOCIsImVtYWlsIjoidXNlcjFAZ21haWwuY29tIiwiaWF0IjoxNzA2MTgxMzA3LCJleHAiOjE3MDcwNDUzMDd9"
      }});
      const responseData = await res.json();
      expect(res.status()).toBe(400);
      expect(responseData.message).toBe("Invalid token");
    });
  });
  
  test.describe.serial("blog", ()=>{
    const baseURL = "http://localhost:5000/api/blog";
  
    test("Get all blogs", async ({ request })=>{
      console.log(accessToken);
      const res = await request.get(`${baseURL}/getBlogs`, {headers:{"auth-token": accessToken}});
      const responseData = await res.json();
      console.log(responseData);
      expect(res.status()).toBe(200);
    });
  
    test("Get blog by ID", async ({request})=>{
      const res = await request.get(`${baseURL}/getBlog/65b73554642fbacd3330359b`, {headers:{"auth-token": accessToken}});
      const responseData = await res.json();
      console.log(responseData);
      expect(res.status()).toBe(200);
    });

    test("Add blog", async ({ request })=>{
      const res = await request.post(`${baseURL}/addBlog`, {data: {
        "title": "blog6",
        "content": "My Wi-Fi is constantly dropping out on both my laptop and desktop. This has occurred on both my home Wi-Fi and when setting up my phone as a hotspot. This 'dropout' still shows the Wi-Fi as connected. However, any network traffic (such as pinging a known IP) fails (EDIT: This was wrong, I couldn't replicate the failure to ping 8.8.8.8. Solution was a DNS issue). This seems to happen after using the internet for anywhere from 2-30 minutes. The only solution to fix this is a reboot, or restart the network manager:"
    }, headers:{"auth-token": accessToken}});
      const responseData = await res.json();
      expect(res.status()).toBe(201);
      expect(responseData.message).toBe("Blog added.");
      blogID = responseData.addedBlog._id;
      console.log(blogID);
    });
    
  
    test("Unauthorised user updating blog", async ({request})=>{
      let token = jwt.sign("data", process.env.SECRET_KEY);
      const res = await request.put(`${baseURL}/updateBlog/${blogID}`, {headers:{"auth-token": token}});
      const responseData = await res.json();
      console.log(responseData);
      expect(res.status()).toBe(401);
      expect(responseData.message).toBe("You are unauthorized to perform this operation.");
    });
  
    test("Delete blog", async ({request})=>{
      const res = await request.delete(`${baseURL}/deleteBlog/${blogID}`, {headers:{"auth-token": accessToken}});
      const responseData = await res.json();
      console.log(responseData);
      expect(res.status()).toBe(201);
    });
  })
})







