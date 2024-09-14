const {
  userCollection
} = require('../../common/constants')
const {
  ERROR
} = require('../../common/error')
const {
  findUser
} = require('../../lib/utils/account')

async function isAuthorizeApproved ({
  uid,
  appIdList
} = {}) {
  const getUserRes = await userCollection.doc(uid).get()
  const userRecord = getUserRes.data[0]
  if (!userRecord) {
    throw {
      errCode: ERROR.ACCOUNT_NOT_EXISTS
    }
  }
  let {
    userMatched
  } = await findUser({
    userQuery: userRecord,
    authorizedApp: appIdList
  })
	userMatched = userMatched.filter(user => user.status !== 4);
  if (userMatched.some(item => item._id !== uid)) {
    throw {
      errCode: ERROR.ACCOUNT_CONFLICT
    }
  }
}

module.exports = {
  isAuthorizeApproved
}
