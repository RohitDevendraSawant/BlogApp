import 'dotenv/config';
import jwt from 'jsonwebtoken';

import request from "supertest";
import app from "../app.js";

// Tests for Users
describe("users", ()=>{
  describe("POST signup route", ()=>{
    describe("Given incorrect or empty data", ()=>{
      it("Should return 400 response and incorrect data message", async ()=>{
          const res = await request(app).post("/api/user/signup")
          .send({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({message: "Incorrect Data"});
      })
    })
  })
})

describe("users", ()=>{
  describe("POST signup route", ()=>{
    describe("Given user regisetring again with same email", ()=>{
      it("Should return statusCode 400 and message user with this email already exists", async ()=>{
        const res= await request(app).post("/api/user/signup")
        .send({ fname: "Rohit", lname: "Sawant", email: "user1@gmail.com", password: "123456", confirmPassword: "123456" });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: "User with this email already exist." });
      })
    })
  })
})

describe("users", ()=>{
  describe("POST login route", ()=>{
    describe("Given the correct email and password", ()=>{
      it("Should return refresh token", async ()=>{
        const res= await request(app).post("/api/user/login")
        .send({ email: 'user1@gmail.com', password: '123456' })

        expect(res.statusCode).toEqual(200)
        expect(Object.keys(res.body).length).toEqual(2);
      })
    })
  })
});

describe('users', ()=>{
  describe('GET blogs route', ()=>{
    describe('Given invalid jwt token', ()=>{
      it("should return 501 status code", async ()=> {

          const token=  jwt.sign({
            id: '65a61f11175f10327111aaa1',
        }, "SOMEWRONGSECRETKEY");

        const res = await request(app).get('/api/blog/getBlogs')
        .set('auth-token', token)

        expect(res.statusCode).toEqual(501);
      })
    })
  })
});


// Tests for blogs
describe('blogs', ()=>{
  describe('GET blogs route', ()=>{
    describe('Given the user logged in', ()=>{
      it("should return blogs", async ()=> {

          const token=  jwt.sign({
            id: '65a61f11175f10327111aaa1',
            email: 'user1@gmail.com'
        }, process.env.SECRET_KEY);

        const res = await request(app).get('/api/blog/getBlogs')
        .set('auth-token', token)

        expect(res.statusCode).toEqual(200);
      })
    })
  })
});

describe('blogs', ()=>{
  describe('PUT updateBlog route', ()=>{
    describe("Given incorrect blogID", ()=>{
      it("should return statusCode 404 and message Blog not found", async ()=>{
          const token=  jwt.sign({
            id: '65a61f11175f10327111aaa1',
            email: 'user1@gmail.com'
        }, process.env.SECRET_KEY);

        const res= await request(app).put('/api/blog/updateBlog/65a66ea134dfba22b8fcf59')
        .set('auth-token', token)
        .send({title: "Blog", author: "", content: ""})

        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({ message: "Blog not found." });
      })
    })
  });
})

describe('blogs', ()=>{
  describe('DELETE deleteBlog route', ()=>{
    describe("Given some another user trying to delete another blog", ()=>{
      it("should return statusCode 401 and message unauthorized user", async ()=>{
          const token=  jwt.sign({
            id: '65a61f11175f10327111aaa1',
            email: 'user1@gmail.com'
        }, process.env.SECRET_KEY);

        const res= await request(app).delete('/api/blog/deleteBlog/65a60b0567602e29fb1c8d2f')
        .set('auth-token', token)

        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ message: "You are unauthorized to perform this operation." });
      })
    })
  });
})
  