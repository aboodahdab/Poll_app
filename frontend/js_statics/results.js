const unique_id = window.UNQIUE_ID;
const $backToPollBtn = document.getElementById("back-to-poll-btn");
const $pollNameParagraph = document.getElementById("poll-title");
const $optionsDiv = document.getElementById("options-percentage-div");
const $totalVotesP = document.getElementById("total-votes-p");
const $shareBtn = document.getElementById("share-button");

$backToPollBtn.addEventListener("click", () => {
  window.location = `/poll/${unique_id}/new_vote`;
});
async function loadData() {
  const fetchedData = await fetch("/get_info", {
    body: JSON.stringify({ unique_id: unique_id }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!fetchedData.ok) {
    throw new Error(`Fetch failed:${fetchedData.status}`);
  }
  const jsonedData = await fetchedData.json();

  loadVotingElements(jsonedData);
}
function loadVotingElements(data) {
  const intelInfo = data["intel_info"];
  const date = intelInfo["date"];
  const votes = intelInfo["votes"];
  const votingName = intelInfo["voting_name"];
  const votingOptions = intelInfo["voting_options"];
  $pollNameParagraph.textContent = votingName;
  const [obj, votesCount] = countVotes(votes);
  totalVotes(votesCount);
  loadVotes(obj);
}
function totalVotes(votes) {
  $totalVotesP.textContent = `Total votes: ${votes}`;
}
function loadVotes(obj) {
  htmlQuery = "";

  for (const [key, value] of Object.entries(obj)) {
    const percentage = Math.floor(value["percent"]);
    const count = value["count"];
    htmlQuery += `<div class="flex flex-col gap-1"> <div class="w-full flex justify-between text-sm"> <p id="option">${key}</p> <p class="" >${percentage}% (${count} votes)</p> </div> <div class="w-full bg-[#E2DEE3] h-3 rounded-full"> <div class="bg-votes-magenta  rounded-full h-3" data-progress="${percentage}" data-element="progress-div" ></div> </div> </div>`;
  }
  $optionsDiv.innerHTML = htmlQuery;
  document
    .querySelectorAll("[data-element='progress-div']")
    .forEach((element) => {
      element.style.maxWidth = `${element.dataset.progress}%`;
    });
}
function countVotes(votes) {
  let votesCount = 0;
  for (const [key, value] of Object.entries(votes)) {
    votesCount += value;
  }

  let obj = {};
  for (const [key, value] of Object.entries(votes)) {
    const votePercentage = (value / votesCount) * 100;
    obj[key] = { percent: votePercentage, count: value };
  }
  return [obj, votesCount];
}
function copyText(string) {
  navigator.clipboard.writeText(string);
}
$shareBtn.addEventListener("click", () => {
  copyText(window.location);
});
window.onload = loadData();
