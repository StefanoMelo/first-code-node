/* - middleware  => Interceptaor => tem o poder de parar ou alterar dados da requisição */
//tratamentos de erros (try catch)

const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())


const users = []

const checkUserId = (req, res, next) => {
  const { id } = req.params
  const index = users.findIndex(user => user.id === id)


  if (index < 0) {
    return res.status(404).json({ error: "User not found" })
  }
  req.userIndex = index
  req.userId = id

  next()
}

app.get('/users', (req, res) => {

  return res.json(users)
})
app.post('/users', (req, res) => {

  try {
    const { name, age } = req.body;

    if (age < 18) throw new Error("Only allowed users over 18 years old")


    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return res.status(201).json(user)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  } finally {
    console.log("Terminou tudo!");
  }
})
app.put('/users/:id', checkUserId, (req, res) => {


  const { name, age } = req.body
  const index = req.userIndex
  const id = req.userId
  const updateUser = { id, name, age }



  users[index] = updateUser


  return res.json(updateUser)
})
app.delete('/users/:id', checkUserId, (req, res) => {
  const index = req.userIndex

  users.splice(index, 1)
  return res.status(204).json()
})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);

})
