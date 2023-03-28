function allTags(data) {
  const tags = new Set();
  data
    .filter((item) => !!item.data.tags)
    .forEach((item) => item.data.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
}

function filterByTag(data, tag) {
  return data.filter((item) => item.data.tags?.includes(tag));
}

function countTag(data, tag) {
  return filterByTag(data, tag).length;
}

function countAllTags(data) {
  return allTags(data).map((tag) => [tag, countTag(data, tag)]);
}

function sortAllTagsByCount(data) {
  return countAllTags(data).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
}

module.exports = {
  allTags,
  filterByTag,
  countTag,
  countAllTags,
  sortAllTagsByCount,
};
