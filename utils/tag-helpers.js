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
  const tagSet = new Set(
    filterByTag(collection, tag)
      .map((item) => item.data.tags)
      .flat(),
  );
  tagSet.delete(tag);
  return Array.from(tagSet);
}

module.exports = {
  allTags,
  filterByTag,
  countTag,
  countAllTags,
  sortAllTagsByCount,
  findAssociatedTags,
};
