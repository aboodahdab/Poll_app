const unique_id = window.UNIQUE_ID;
const $votingForm = document.getElementById("voting_form_inputs_div");
const $voteBtn = document.getElementById("voting_btn");
const $containerDiv = document.getElementById("container");
const $outerVotingForm = document.getElementById("voting_form");
const $pollTitle = document.getElementById("poll_title");
const $theMessageDiv = document.getElementById("the-message-div");
const $errorSvg = document.querySelector("#error-svg");
const $successSvg = document.querySelector("#success-svg");
const $theMessageP = document.getElementById("the-message-p");

let $votingBtns = document.querySelectorAll("[data-vote='voting-label']");

async function get_info() {
  const dataFetch = await fetch("/get_info", {
    method: "POST",

    body: JSON.stringify({
      unique_id: unique_id,
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (!dataFetch.ok) {
    throw new Error(`fetch failed: ${dataFetch.status}`);
  }
  const jsonedData = await dataFetch.json();

  return jsonedData;
}
async function createVotingElementsHtml() {
  const data = await get_info();
  const infoData = data["intel_info"];
  const votingOptions = infoData["voting_options"];
  const votes = infoData["votes"];
  console.log(votingOptions, infoData, votes);
  $votingForm.innerHTML = "";
  let query = "";
  for (const [key, value] of Object.entries(votes)) {
    const title = value["title"];

    query += `<label data-vote="voting-label"  data-id="${key}" class="border-solid border-[1px] border-[rgb(213,204,215)] p-4 rounded-lg flex gap-3 items-center text-sm font-medium cursor-pointer transition duration-150ms cubic hover:bg-weird-red" id="" > <button class="h-4 w-4 border-solid border-[1px] border-black-700 rounded-full flex items-center justify-center" data-checked="unchecked" ></button >${title}</label >`;
  }
  $votingForm.innerHTML = query;
  $votingBtns = document.querySelectorAll("[data-vote='voting-label']");

  $pollTitle.textContent = infoData["voting_name"];
}
async function makeNewVote(voteId, voteTitle) {
  const dataFetch = await fetch("/new_vote", {
    method: "POST",

    body: JSON.stringify({
      unique_id: unique_id,
      vote: voteId,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (!dataFetch.ok) {
    throw new Error(`fetch failed: ${dataFetch.status}`);
  }
  changeUi(voteTitle);
}

window.onload = async () => {
  await createVotingElementsHtml();
  $votingBtns.forEach(($element) => {
    console.log("---border---");
    $element.addEventListener("click", (event) => {
      $votingBtns.forEach(($element2) => {
        const $element_btn2 = $element2.querySelector("button");
        if ($element_btn2.dataset.checked == "checked") {
          $element_btn2.dataset.checked = "unchecked";
          uncheck_element($element_btn2);
        }
      });
      const $element_btn = $element.querySelector("button");
      if ($element_btn.dataset.checked == "unchecked") {
        check_element($element_btn);
        $element_btn.dataset.checked = "checked";
      } else if ($element_btn.dataset.checked == "checked") {
        console.log("already checked");
        return;
      }
    });
  });
};
function get_checked_element() {
  const $element_btn = document.querySelector("[data-checked='checked']");
  if (!$element_btn) {
    return null; // nothing selected
  }

  return $element_btn.parentElement;
}
function check_element($btn) {
  $btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle h-2.5 w-2.5 fill-current text-current"><circle cx="12" cy="12" r="10"></circle></svg>`;
}
function uncheck_element($btn) {
  $btn.innerHTML = "";
}
$voteBtn.addEventListener("click", () => {
  if ($voteBtn.dataset.view_results == "true") {
    window.location = `/poll/${unique_id}/results`;
  }
  const $element = get_checked_element();
  if (!$element) {
    return;
  }
  const voteId = $element.dataset.id;
  const voteTitle = $element.textContent;
  console.log(voteId, voteTitle);
  showMessage("Your vote has been recorded!", true);

  makeNewVote(voteId, voteTitle);
});
function changeUi(vote) {
  $votingForm.innerHTML = "";
  $pollTitle.textContent = "Thanks for voting!";
  $outerVotingForm.classList.add("gap-4");
  $outerVotingForm.classList.remove("gap-6");

  $votingForm.innerHTML += `<p class="text-sm text-light-purple"  id="you-voted-for-p">You voted for  <span class="text-[#40334D] font-medium">${vote}</span> </p>`;
  $voteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column mr-2 h-4 w-4"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg> view results`;
  $voteBtn.dataset.view_results = "true";
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
