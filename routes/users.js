const express = require("express");
const router = express.Router();

const users = require("../data/users");
const error = require("../utilities/error.js");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    const { name, username, email } = req.body;
    if (name && username && email) {
      if (users.find((u) => u.username === username)) {
        return next(error(409, "Username Already Taken")); 
      }


      const user = {
        id: users[users.length - 1].id + 1,
        name,
        username,
        email
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (user) {
      res.json({ user, links });
    } else {
      next(error(404, "User Not Found"));
    }
  })

  .patch((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    if (user) {
      Object.assign(user, req.body);
      res.json(user);
    } else {
      next(error(404, "User Not Found"));
    }
  })

.delete((req, res, next) => {
    const userIndex = users.findIndex((u) => u.id == req.params.id);
    if (userIndex !== -1) {
      const [deletedUser] = users.splice(userIndex, 1);
      res.json(deletedUser);
    } else {
      next(error(404, "User Not Found"));
    }
  });

module.exports = router;
