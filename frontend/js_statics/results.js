const unique_id = window.UNQIUE_ID;
const $backToPollBtn = document.getElementById("back-to-poll-btn");
const $pollNameParagraph = document.getElementById("poll-title");
const $optionsDiv = document.getElementById("options-percentage-div");
const $totalVotesP = document.getElementById("total-votes-p");
const $shareBtn = document.getElementById("share-button");
const $theMessageDiv = document.getElementById("the-message-div");
const $errorSvg = document.querySelector("#error-svg");
const $successSvg = document.querySelector("#success-svg");
const $theMessageP = document.getElementById("the-message-p");
const $infoP = document.getElementById("info-p");

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

function showMessage(msg, mode) {
  const $theRealSvg = mode ? $successSvg : $errorSvg;

  $theRealSvg.classList.remove("hidden");
  $theMessageDiv.classList.remove("translate-y-full");
  $theMessageDiv.classList.remove("bottom-0");
  $theMessageDiv.classList.add("bottom-8");
  $theMessageP.textContent = msg;
  setTimeout(() => {
    $theMessageDiv.classList.add("translate-y-full");
    $theMessageDiv.classList.add("bottom-0");
    $theMessageDiv.classList.remove("bottom-8");
    $theMessageDiv.addEventListener(
      "transitionend",
      () => {
        $theRealSvg.classList.add("hidden");
      },
      { once: true },
    );
  }, 4000);
}

function loadVotingElements(data) {
  const intelInfo = data["intel_info"];
  const date = intelInfo["date"];
  console.log(date);
  const votes = intelInfo["votes"];
  console.log(votes, "you votes");
  const votingName = intelInfo["voting_name"];

  $pollNameParagraph.textContent = votingName;
  const [obj, votesCount] = countVotes(votes);
  console.log(obj, votesCount);
  totalVotes(votesCount);

  loadVotes(obj);
  const time = transformTime(date);
  loadDatetime(time);
}
function loadDatetime(time) {
  $infoP.textContent = `by a guest · ${time}`;
}
function totalVotes(votes) {
  $totalVotesP.textContent = `Total votes: ${votes}`;
}
function loadVotes(obj) {
  let htmlQuery = "";
  for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
    let percentage = Math.floor(value["percent"]);
    let count = value["count"];
    let title = value["title"];
    console.log(title, value);
    if (!percentage) {
      percentage = 0;
      count = 0;
    }

    htmlQuery += `<div class="flex flex-col gap-1"> <div class="w-full flex justify-between text-sm"> <p id="option">${title}</p> <p class="" >${percentage}% (${count} votes)</p> </div> <div class="w-full bg-[#E2DEE3] h-3 rounded-full"> <div class="bg-votes-magenta  rounded-full h-3" data-progress="${percentage}" data-element="progress-div" ></div> </div> </div>`;
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
    console.log(value);
    let count = value["count"];
    votesCount += count;
  }

  let obj = {};
  for (const [key, value] of Object.entries(votes)) {
    let count = value["count"];
    let voteTitle = value["title"];
    const votePercentage = (count / votesCount) * 100;
    console.log(value, voteTitle);
    obj[key] = { percent: votePercentage, count: count, title: voteTitle };
  }

  return [obj, votesCount];
}
function copyText(string) {
  navigator.clipboard.writeText(string);
}
$shareBtn.addEventListener("click", () => {
  copyText(window.location);
  showMessage("Link copied to clipboard!", true);
});
window.onload = loadData();

const now = Date.now();
function transformTime(time) {
  // Timestamps coming from the server are in GMT.

  console.log(time, typeof time);
  time = +time;
  time = now - time;
  console.log(time);

  const minutes = Math.floor(time / (1000 * 60));
  const hours = Math.floor(time / (1000 * 60 * 60));
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const months = Math.floor(time / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(time / (1000 * 60 * 60 * 24 * 30 * 12));

  console.log("mins", minutes);
  console.log("hours", hours);
  console.log("days", days);
  console.log("months", months);
  console.log("years", years);
  let finalDate = "Just now";
  if (years >= 1) {
    console.log("years");
    years == 1
      ? (finalDate = `${years} year ago`)
      : (finalDate = `${years} years ago`);
  } else if (months >= 1) {
    console.log("years");
    months == 1
      ? (finalDate = `${months} month ago`)
      : (finalDate = `${months} months ago`);
  } else if (days >= 1) {
    console.log("years");
    days == 1
      ? (finalDate = `${days} day ago`)
      : (finalDate = `${days} days ago`);
  } else if (hours >= 1) {
    console.log("years");
    hours == 1
      ? (finalDate = `${hours} hour ago`)
      : (finalDate = `${hours} hours ago`);
  } else if (minutes >= 1) {
    console.log("years");
    minutes == 1
      ? (finalDate = `${minutes} minute ago`)
      : (finalDate = `${minutes} minutes ago`);
  }
  return finalDate;
}
