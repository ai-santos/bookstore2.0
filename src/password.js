import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

const encrypt = (password) => {
  return bcrypt.hashSync(password, salt);
}

const compare = (password, encrypted_pasword) => {
  return bcrypt.compareSync(password, encrypted_pasword);
}

export default {
  encrypt,
  compare
}