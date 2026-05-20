const $submitBtn = document.querySelector("#submit-btn");
const $titleInput = document.querySelector("#title-input");
const $optionsBtn = document.querySelector("#ops-btn");
const $optionsDiv = document.querySelector("#ops-div");
const $firstSvgDiv = document.querySelector("#first-svg-div");
const $pageContainer = document.querySelector("#the-everything-div");
const $theMessageDiv = document.querySelector("#the-message-div");
const $theMessageP = document.querySelector("#the-message-p");
const $errorSvg = document.querySelector("#error-svg");
const $successSvg = document.querySelector("#success-svg");

let $optionsInputs = document.querySelectorAll("[data-element='option']");

let inputCounter = 1;
$pageContainer.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-del")) {
    event.target.parentElement.parentElement.remove();
    inputCounter -= 1;
    changePlaceHolder(inputCounter);
    if (inputCounter <= 1) {
      document
        .querySelector("[data-del]")
        .parentElement.classList.add("hidden");
    }
  }
});
function changePlaceHolder() {
  let count = 1;
  $optionsInputs = document.querySelectorAll("[data-element='option']"); // fresh list

  $optionsInputs.forEach((element) => {
    element.placeholder = `Option ${count}`;
    count += 1;
  });
}
async function sendPoll(title, options) {
  const createFetch = await fetch("/create", {
    method: "POST",
    body: JSON.stringify({
      question: title,
      options: options,
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (!createFetch.ok) {
    return;
  }
  const jsoned_result = await createFetch.json();
  console.log(jsoned_result, "it's result");
  return jsoned_result;
}
$optionsBtn.addEventListener("click", () => {
  ShowTheDelBtn();
  addTheOption();
});
function ShowTheDelBtn() {
  inputCounter += 1;
  if (inputCounter > 1) {
    console.log("no k");
    $firstSvgDiv.classList.remove("hidden");
  }
}

function addTheOption() {
  const classes = [
    "border-[rgb(236,233,236)]",
    "w-full",
    "border-[1px]",
    "border-solid",
    "rounded-[6px]",
    "bg-inputs-background",
    "py-2",
    "px-3",
    "focus-visible:outline-magenta",
  ];

  const newElement = document.createElement("input");
  const newDiv = document.createElement("div");
  const newDiv2 = document.createElement("div");
  newDiv2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" data-del="del-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>`;
  const svgDivClasses =
    "h-10 w-11 flex justify-center items-center rounded-[6px] hover:bg-[rgb(205,152,156)] cursor-pointer".split(
      " ",
    );

  newDiv2.classList.add(...svgDivClasses);

  newElement.dataset.element = "option";
  newElement.placeholder = `Option ${inputCounter}`;
  newElement.classList.add(...classes);
  const newDivClasses = "flex gap-2 items-center ::placeholder text-sm".split(
    " ",
  );
  newDiv.classList.add(...newDivClasses);

  newDiv.append(newElement);
  newDiv.append(newDiv2);

  $optionsDiv.append(newDiv);

  $optionsInputs = document.querySelectorAll("[data-element='option']");
}
function checkIfDataIsFilled(title, options) {
  if (!title) {
    showMessage("Please enter a poll title.", false);
    return false;
  }
  if (options.length < 2) {
    // could return a msg here to user
    showMessage("Please add at least two answer options.", false);
    return false;
  }
  return true;
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
function changeTheUI(unqiue_id) {
  $pageContainer.innerHTML = ` <div class="flex flex-col gap-6 max-w-[448px] w-full gap-5" id="the-everything-div" > <div id="create-poll-weird-div" class="text-[24px] font-semibold text-center"> Poll Created! </div> <div class="border-[1px] border-[hsl(290,12%,82%,1)] border-solid rounded-[6px] flex flex-col justify-center p-6 pt-11 bg-[#ffff]" id="poll-form-div" > <label class="text-sm text-center text-weird-text-magenta"> Share this link </label> <div class="m-w-[350px] flex mt-2 gap-2"> <input type="text" class="border-[rgb(236,233,236)] border-[1px] border-solid rounded-[6px] text-sm bg-inputs-background py-2 px-3 w-full" readonly id="readonly-data-input"  /> <button id="copy-btn" class="border-[rgb(236,233,236)] border-[1px] border-solid bg-inputs-background flex justify-center rounded-md w-[46px] h-10 items-center cursor-pointer transition duration-150 ease-in-out hover:bg-weird-red" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy h-4 w-4" > <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" ></path> </svg> </button> </div> <div class="mt-5"> <button class="bg-white-weird-magenta py-2 px-4 w-full rounded-md font-sm cursor-pointer flex justify-center items-center" id="view-results-btn" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2 h-4 w-4" > <path d="M3 3v16a2 2 0 0 0 2 2h16"></path> <path d="M18 17V9"></path> <path d="M13 17V5"></path> <path d="M8 17v-3"></path> </svg> View Results </button> </div> </div> <div class="flex items-center gap-2 bg-weird-white border-solid border-[1px] border-[rgb(213,204,215)] max-w-89 w-full p-4 rounded-[8px] right-8 ease-in-out translate-y-full duration-500 transiton-transform absolute bottom-0" id="the-message-div" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy h-4 w-4" > <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path> </svg> <p id="the-error-p" class="text-[13px]">Please enter a poll title</p> </div> </div> `;
  const $copyBtn = document.querySelector("#copy-btn");
  const $dataInput = document.querySelector("#readonly-data-input");

  $dataInput.value = window.location.href + `poll/${unqiue_id}/results`;
  const link = $dataInput.value;
  const viewResultsBtn = document.getElementById("view-results-btn");
  viewResultsBtn.onclick = () => {
    window.location = link;
  };
  $copyBtn.addEventListener("click", () => {
    console.log("Link copied!");
    navigator.clipboard.writeText(link);
    showMessage("Link copied to clipboard!", true);
  });
}
$submitBtn.addEventListener("click", async () => {
  const inputVal = $titleInput.value;
  const options3 = [];
  console.log($optionsInputs, $optionsInputs.length);
  $optionsInputs.forEach((input) => {
    const option = input.value;

    if (option) {
      // this will not add a new option if it's an empty string
      options3.push(option);
    }
  });

  if (!checkIfDataIsFilled(inputVal, options3)) {
    return;
  }
  const awaited_result = await sendPoll(inputVal, options3);
  const unqiue_id = awaited_result.unique_id;

  changeTheUI(unqiue_id);
});
