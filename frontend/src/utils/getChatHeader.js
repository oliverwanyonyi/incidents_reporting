export const getChatDetails = (currentUser, users) => {
 
    if (currentUser?.id === users[0]?.user) {
      return users[1];
    } else {
      return users[0];
    }
  };