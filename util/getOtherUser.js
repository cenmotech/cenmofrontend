const getOtherUser = (users, currUser) => {
    return users?.filter(user => user !== currUser)[0];
}

export default getOtherUser;