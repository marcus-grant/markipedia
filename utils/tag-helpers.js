function allTags(collection) {
  return Array.from(
    new Set(
      collection
        .filter((item) => !!item.data.tags)
        .map((item) => item.data.tags)
        .flat(),
    ),
  );
}

function filterByTag(collection, tag) {
  return collection.filter((item) => item.data.tags?.includes(tag));
}

function countTag(collection, tag) {
  return filterByTag(collection, tag).length;
}

function countAllTags(collection) {
  return allTags(collection).map((tag) => (
    { tag, count: countTag(collection, tag) }
  ));
}

function sortAllTagsByCount(collection) {
  return countAllTags(collection)
    .sort((a, b) => b.count - a.count)
    .map((x) => x.tag);
}

// TODO: FIXME this is producing empty arrays on all tags collections
function findAssociatedTags(collection, tag) {
  return Array
    .from(
      new Set(
        filterByTag(collection, tag)
          .map((item) => item.data.tags)
          .flat(),
      ).delete(tag),
    );
}

// TODO: DELETEME This might not be needed if we sort this collection as its being built
// function sortTagsCollectionByCount(tagsCollection) {
//   return tagsCollection.sort((a, b) => b.count - a.count);
// }

module.exports = {
  allTags,
  filterByTag,
  countTag,
  countAllTags,
  sortAllTagsByCount,
  findAssociatedTags,
  // sortTagsCollectionByCount,
};
