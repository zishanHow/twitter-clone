import { tweetsData as tweets } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

// let likeFromLocalStorage = JSON.parse(localStorage.getItem("like"))
// let retweetFromLocalStorage = JSON.parse(localStorage.getItem("retweet"))

let tweetsData = [...tweets]


if (localStorage.getItem('tweets')) {
    tweetsData = JSON.parse(localStorage.getItem('tweets'))
}


// if (likeFromLocalStorage) {
//     tweetsData.forEach(function (tweet) {
//         tweet.likes++
//     })
// }

// if(retweetFromLocalStorage) {
//     console.log("you retweet me!")
// }else {
//     console.log("won't you retweet me?")
// }



document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    // I ADD 
    else if (e.target.dataset.del) {
        handleDeleteTweet(e.target.dataset.del)
    }
    // reply to tweet. it didn't work, i will work with it later
    else if (e.target.dataset.comment) {
        handleCommentBtnClick(e.target.dataset.comment)
    }
})

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveToStorage()
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveToStorage()
    render()
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        saveToStorage()
        render()
        tweetInput.value = ''
    }

}

// I ADD, but i don't understand this function i just copy it. 
function handleDeleteTweet(tweetId) {
    const targetTweet = tweetsData.map((tweet) => tweet.uuid).indexOf(tweetId)
    tweetsData.splice(targetTweet, 1)
    saveToStorage()
    render()
}

// reply to tweet. it didn't work, i will work with it later
function handleCommentBtnClick(tweetId) {
    const targetTweetObj = tweetsData.filter((tweet) => {
        return tweetId === tweet.uuid
    })[0]

    let textComments = document.getElementById(`comments-${tweetId}`).value
    if (textComments) {
        targetTweetObj.replies.unshift({
            handle: '@Scrimba',
            profilePic: `images/scrimbalogo.png`,
            tweetText: textComments
        })
        saveToStorage()
        render()
    }
}

function saveToStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
}

function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }


        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
            })
        }

        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="deleteBtn">
                <button class="del" id="del-btn${tweet.uuid}" data-del="${tweet.uuid}">X</button>
            </div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">



    <div class="tweet-comment">
        <img src='images/scrimbalogo.png' class='profile-pic'/>
        <div class='tweet-comment-inner'>
            <p class="handle">@Scrimba</p>
            <textarea id='comments-${tweet.uuid}' placeholder="type comment here..." class="tweet-text tweet-comment-textarea"></textarea>
            <button class="comment-btn" data-comment="${tweet.uuid}">Comment</button>
        </div>
    </div>



        ${repliesHtml}
    </div>   
</div>
`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()