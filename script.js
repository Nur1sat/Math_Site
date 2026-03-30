const tasks = [
  {
    category: "Последовательности",
    level: "Лёгкое",
    question: "Какое число должно стоять дальше?",
    visual: ["2", "4", "6", "8", "?"],
    options: ["9", "10", "11", "12"],
    answer: 1,
    explanation: "Числа увеличиваются на 2, поэтому после 8 идёт 10."
  },
  {
    category: "Сравнение",
    level: "Лёгкое",
    question: "Что здесь лишнее?",
    visual: ["Круг", "Квадрат", "Треугольник", "Собака"],
    options: ["Круг", "Собака", "Квадрат", "Треугольник"],
    answer: 1,
    explanation: "Три слова обозначают фигуры, а собака к ним не относится."
  },
  {
    category: "Пространство",
    level: "Среднее",
    question: "Если стрелка была направлена вверх и повернулась направо, куда она смотрит теперь?",
    visual: ["↑", "↻", "?"],
    options: ["←", "↓", "→", "↗"],
    answer: 2,
    explanation: "Поворот направо переводит стрелку из положения вверх в положение вправо."
  },
  {
    category: "Стратегия",
    level: "Среднее",
    question: "У Лены 3 красных карандаша и 2 синих. Сколько всего карандашей?",
    visual: ["3 красных", "+", "2 синих", "="],
    options: ["4", "5", "6", "7"],
    answer: 1,
    explanation: "Нужно объединить две группы: 3 + 2 = 5."
  },
  {
    category: "Внимательность",
    level: "Среднее",
    question: "Какая буква встречается два раза?",
    visual: ["М", "А", "Р", "А", "К"],
    options: ["М", "А", "Р", "К"],
    answer: 1,
    explanation: "Буква А стоит на второй и четвёртой позиции."
  },
  {
    category: "Последовательности",
    level: "Среднее",
    question: "Выбери фигуру, которая продолжит ряд.",
    visual: ["●", "●●", "●●●", "?"],
    options: ["●", "●●", "●●●", "●●●●"],
    answer: 3,
    explanation: "Каждый раз добавляется один кружок: 1, 2, 3, потом 4."
  },
  {
    category: "Сравнение",
    level: "Среднее",
    question: "Какой предмет не подходит к остальным?",
    visual: ["Стол", "Стул", "Шкаф", "Яблоко"],
    options: ["Стол", "Шкаф", "Яблоко", "Стул"],
    answer: 2,
    explanation: "Три варианта относятся к мебели, а яблоко относится к еде."
  },
  {
    category: "Пространство",
    level: "Сложнее",
    question: "Мяч лежит слева от коробки. Где коробка относительно мяча?",
    visual: ["⚽", "⬜"],
    options: ["Слева", "Справа", "Сверху", "Снизу"],
    answer: 1,
    explanation: "Если мяч слева от коробки, значит коробка находится справа от мяча."
  },
  {
    category: "Стратегия",
    level: "Сложнее",
    question: "Чтобы получить 10, что нужно прибавить к 6?",
    visual: ["6", "+", "?", "=", "10"],
    options: ["2", "3", "4", "5"],
    answer: 2,
    explanation: "От 10 отнимаем 6 и получаем 4."
  },
  {
    category: "Внимательность",
    level: "Сложнее",
    question: "Найди правильное утверждение.",
    visual: ["Кошка меньше шкафа", "Шкаф выше стула", "Стул выше шкафа"],
    options: [
      "Стул выше шкафа",
      "Шкаф выше стула",
      "Кошка выше шкафа",
      "Шкаф меньше кошки"
    ],
    answer: 1,
    explanation: "Из предложенных вариантов логически верным остаётся только 'Шкаф выше стула'."
  },
  {
    category: "Последовательности",
    level: "Сложнее",
    question: "Какое число пропущено?",
    visual: ["1", "3", "5", "?", "9"],
    options: ["6", "7", "8", "10"],
    answer: 1,
    explanation: "Это ряд нечётных чисел: 1, 3, 5, 7, 9."
  },
  {
    category: "Стратегия",
    level: "Сложнее",
    question: "У тебя 7 наклеек. Ты подарил 2 и потом получил ещё 3. Сколько стало?",
    visual: ["7", "−", "2", "+", "3"],
    options: ["7", "8", "9", "10"],
    answer: 1,
    explanation: "Сначала 7 − 2 = 5, потом 5 + 3 = 8."
  }
];

const taskCategory = document.getElementById("task-category");
const taskLevel = document.getElementById("task-level");
const taskIndex = document.getElementById("task-index");
const taskQuestion = document.getElementById("task-question");
const taskVisual = document.getElementById("task-visual");
const taskOptions = document.getElementById("task-options");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackText = document.getElementById("feedback-text");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");
const resolvedCount = document.getElementById("resolved-count");
const correctCount = document.getElementById("correct-count");
const currentTrack = document.getElementById("current-track");
const upcomingList = document.getElementById("upcoming-list");

let currentTaskIndex = 0;
let resolved = 0;
let correct = 0;
let locked = false;

function renderVisual(items) {
  const wrapperClass = items.every((item) => item.length <= 2) ? "symbol-row" : "sequence-row";
  return `
    <div class="${wrapperClass}">
      ${items
        .map(
          (item) => `<span class="${wrapperClass === "symbol-row" ? "symbol-chip" : "sequence-chip"}">${item}</span>`
        )
        .join("")}
    </div>
  `;
}

function renderUpcoming() {
  if (currentTaskIndex >= tasks.length) {
    upcomingList.innerHTML = `
      <li>
        <strong>Финиш</strong>
        <span>Спринт завершён. Можно начать заново.</span>
      </li>
    `;
    return;
  }

  const upcoming = tasks.slice(currentTaskIndex + 1, currentTaskIndex + 4);
  upcomingList.innerHTML = upcoming
    .map(
      (task, index) => `
        <li>
          <strong>${index + currentTaskIndex + 2}</strong>
          <span>${task.category}</span>
        </li>
      `
    )
    .join("");

  if (!upcoming.length) {
    upcomingList.innerHTML = `
      <li>
        <strong>Финиш</strong>
        <span>Это последняя задача в спринте.</span>
      </li>
    `;
  }
}

function updateStats() {
  resolvedCount.textContent = `${resolved} / ${tasks.length}`;
  correctCount.textContent = String(correct);
  currentTrack.textContent = tasks[currentTaskIndex]?.category ?? "Спринт завершён";
}

function resetFeedback() {
  feedbackPanel.className = "feedback-panel";
  feedbackTitle.textContent = "Выбери один вариант";
  feedbackText.textContent = "После ответа здесь появится короткое объяснение.";
}

function renderTask() {
  const task = tasks[currentTaskIndex];
  locked = false;

  taskCategory.textContent = task.category;
  taskLevel.textContent = task.level;
  taskIndex.textContent = `Задача ${currentTaskIndex + 1} из ${tasks.length}`;
  taskQuestion.textContent = task.question;
  taskVisual.innerHTML = renderVisual(task.visual);
  taskOptions.innerHTML = "";
  nextButton.textContent = currentTaskIndex === tasks.length - 1 ? "Показать результат" : "Следующая задача";

  task.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "task-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(index));
    taskOptions.appendChild(button);
  });

  resetFeedback();
  updateStats();
  renderUpcoming();
}

function finishSprint() {
  currentTaskIndex = tasks.length;
  locked = true;
  taskCategory.textContent = "Готово";
  taskLevel.textContent = "Итог";
  taskIndex.textContent = "Спринт завершён";
  taskQuestion.textContent = "Хорошая база для сайта с логическими задачами.";
  taskVisual.innerHTML = `
    <div class="sequence-row">
      <span class="sequence-chip">Верно: ${correct}</span>
      <span class="sequence-chip">Всего: ${tasks.length}</span>
    </div>
  `;
  taskOptions.innerHTML = "";
  feedbackPanel.className = "feedback-panel success";
  feedbackTitle.textContent = "Финал";
  feedbackText.textContent =
    correct === tasks.length
      ? "Все ответы верные. Можно добавлять уровни, сохранение прогресса и личный кабинет."
      : "Демо уже показывает механику. Следующим шагом можно добавить авторизацию, базу заданий и фильтры.";
  nextButton.disabled = true;
  currentTrack.textContent = "Спринт завершён";
  renderUpcoming();
}

function handleAnswer(index) {
  if (locked) {
    return;
  }

  const task = tasks[currentTaskIndex];
  const buttons = Array.from(taskOptions.querySelectorAll(".task-option"));
  const isCorrect = index === task.answer;

  locked = true;
  resolved += 1;

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;

    if (buttonIndex === task.answer) {
      button.classList.add("correct");
    }

    if (buttonIndex === index && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    correct += 1;
    feedbackPanel.className = "feedback-panel success";
    feedbackTitle.textContent = "Верно";
  } else {
    feedbackPanel.className = "feedback-panel error";
    feedbackTitle.textContent = "Почти";
  }

  feedbackText.textContent = task.explanation;
  updateStats();
}

nextButton.addEventListener("click", () => {
  if (!locked && currentTaskIndex !== tasks.length - 1) {
    return;
  }

  if (!locked && currentTaskIndex === tasks.length - 1) {
    return;
  }

  if (currentTaskIndex === tasks.length - 1) {
    finishSprint();
    return;
  }

  currentTaskIndex += 1;
  renderTask();
});

restartButton.addEventListener("click", () => {
  currentTaskIndex = 0;
  resolved = 0;
  correct = 0;
  nextButton.disabled = false;
  renderTask();
});

renderTask();
