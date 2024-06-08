import React from 'react'

function friendsCard({friend, allFriends, setAllFriends, user}){
// console.log(friend)
    if(friend.selfuser_id === user.id){
        return (
            <div>
                    <p>
                       {friend.friend_id}
                    </p>
            </div>
        )
    }
    else{
        return
    }


}
export default friendsCard;