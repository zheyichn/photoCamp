export function likesFilter(currentStatus, currentLikedBy, userId) {
  if (currentStatus) {
    // if right now like == true, click again means user want to unlike it
    const filteredList = currentLikedBy.filter((x) => x !== userId);
    return filteredList;
  } else {
    // otherwise, add current userid into the post's likedByUser list
    currentLikedBy.push(userId);
    return currentLikedBy;
  }
}
