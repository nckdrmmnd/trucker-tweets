import React from 'react'
import FriendsCard from "./FriendsCard"

function FriendsList({allFriends, setAllFriends, user}){
    const friends = allFriends
    console.log(friends)
    

    const friendsList = friends?.map((friend) => {
        return <FriendsCard key={friend.id} friend={friend} setAllFriends={setAllFriends} user={user}/>
      })
    
      return (
        <div>
          <ul className='cards'>Friends List by user id{friendsList}</ul>
        </div>
      )
}
export default FriendsList;
