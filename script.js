const STORAGE_KEYS = {
  tasks: "logic-spark.tasks.v2",
  progress: "logic-spark.progress.v2",
  adminAuth: "logic-spark.admin-auth.v1"
};

const DEMO_ADMIN = {
  email: "admin@logicspark.app",
  password: "spark-admin-2026"
};

const DEFAULT_TASKS = [
  {
    id: "seed-1",
    title: "Продолжи ряд",
    category: "Последовательности",
    difficulty: "Старт",
    prompt: "Какое число должно стоять дальше?",
    visual: ["2", "4", "6", "8", "?"],
    options: ["9", "10", "11", "12"],
    answer: 1,
    explanation: "Числа растут на 2, поэтому после 8 идёт 10.",
    source: "seed"
  },
  {
    id: "seed-2",
    title: "Найди лишнее",
    category: "Сравнение",
    difficulty: "Старт",
    prompt: "Какое слово не подходит к остальным?",
    visual: ["Круг", "Квадрат", "Треугольник", "Собака"],
    options: ["Круг", "Собака", "Квадрат", "Треугольник"],
    answer: 1,
    explanation: "Три варианта обозначают фигуры, а собака к фигурам не относится.",
    source: "seed"
  },
  {
    id: "seed-3",
    title: "Поворот стрелки",
    category: "Пространство",
    difficulty: "Уверенно",
    prompt: "Если стрелка была направлена вверх и повернулась направо, куда она смотрит теперь?",
    visual: ["↑", "↻", "?"],
    options: ["←", "↓", "→", "↗"],
    answer: 2,
    explanation: "После поворота направо стрелка из положения вверх смотрит вправо.",
    source: "seed"
  },
  {
    id: "seed-4",
    title: "Короткая стратегия",
    category: "Стратегия",
    difficulty: "Уверенно",
    prompt: "Чтобы получить 10, что нужно прибавить к 6?",
    visual: ["6", "+", "?", "=", "10"],
    options: ["2", "3", "4", "5"],
    answer: 2,
    explanation: "Из 10 вычитаем 6 и получаем 4.",
    source: "seed"
  },
  {
    id: "seed-5",
    title: "Проверка внимания",
    category: "Внимательность",
    difficulty: "Уверенно",
    prompt: "Какая буква встречается два раза?",
    visual: ["М", "А", "Р", "А", "К"],
    options: ["М", "А", "Р", "К"],
    answer: 1,
    explanation: "Буква А стоит на второй и четвёртой позиции.",
    source: "seed"
  },
  {
    id: "seed-6",
    title: "Кто справа",
    category: "Пространство",
    difficulty: "Сложно",
    prompt: "Мяч лежит слева от коробки. Где коробка относительно мяча?",
    visual: ["⚽", "⬜"],
    options: ["Слева", "Справа", "Сверху", "Снизу"],
    answer: 1,
    explanation: "Если мяч слева, то коробка находится справа от мяча.",
    source: "seed"
  }
];

const state = {
  adminAuthenticated: loadAdminAuth(),
  tasks: loadTasks(),
  progress: loadProgress(),
  editingTaskId: "",
  adminSearch: "",
  studentSearch: "",
  studentCategory: "all",
  studentDifficulty: "all",
  selectedStudentTaskId: "",
  studentEvaluation: null
};

const adminAuthView = document.getElementById("admin-auth-view");
const adminDashboardView = document.getElementById("admin-dashboard-view");
const adminLoginCard = document.getElementById("admin-login-card");
const adminLoginForm = document.getElementById("admin-login-form");
const adminEmailInput = document.getElementById("admin-email-input");
const adminPasswordInput = document.getElementById("admin-password-input");
const adminLoginStatus = document.getElementById("admin-login-status");
const totalTasksCount = document.getElementById("total-tasks-count");
const manualTasksCount = document.getElementById("manual-tasks-count");
const importedTasksCount = document.getElementById("imported-tasks-count");
const adminStatus = document.getElementById("admin-status");
const categoryList = document.getElementById("category-list");
const taskUpload = document.getElementById("task-upload");
const exportButton = document.getElementById("export-button");
const restoreDemoButton = document.getElementById("restore-demo-button");
const formTitle = document.getElementById("form-title");
const taskForm = document.getElementById("task-form");
const taskIdInput = document.getElementById("task-id");
const titleInput = document.getElementById("title-input");
const categoryInput = document.getElementById("category-input");
const difficultyInput = document.getElementById("difficulty-input");
const visualInput = document.getElementById("visual-input");
const promptInput = document.getElementById("prompt-input");
const explanationInput = document.getElementById("explanation-input");
const answerInput = document.getElementById("answer-input");
const saveButton = document.getElementById("save-button");
const resetFormButton = document.getElementById("reset-form-button");
const adminSearch = document.getElementById("admin-search");
const adminTaskList = document.getElementById("admin-task-list");
const optionInputs = [0, 1, 2, 3].map((index) => document.getElementById(`option-${index}`));

const studentTotalCount = document.getElementById("student-total-count");
const studentSolvedCount = document.getElementById("student-solved-count");
const studentCorrectCount = document.getElementById("student-correct-count");
const studentSearch = document.getElementById("student-search");
const studentCategoryFilter = document.getElementById("student-category-filter");
const studentDifficultyFilter = document.getElementById("student-difficulty-filter");
const studentTaskList = document.getElementById("student-task-list");
const studentTaskCategory = document.getElementById("student-task-category");
const studentTaskDifficulty = document.getElementById("student-task-difficulty");
const studentTaskSource = document.getElementById("student-task-source");
const studentTaskTitle = document.getElementById("student-task-title");
const studentTaskPrompt = document.getElementById("student-task-prompt");
const studentTaskVisual = document.getElementById("student-task-visual");
const studentTaskOptions = document.getElementById("student-task-options");
const studentFeedback = document.getElementById("student-feedback");
const studentFeedbackTitle = document.getElementById("student-feedback-title");
const studentFeedbackText = document.getElementById("student-feedback-text");
const studentResetAnswer = document.getElementById("student-reset-answer");
const studentNextTask = document.getElementById("student-next-task");

const landingPreviewList = document.getElementById("landing-preview-list");
const landingActivityNote = document.getElementById("landing-activity-note");

function createId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneDefaultTasks() {
  return DEFAULT_TASKS.map((task) => ({
    ...task,
    visual: [...task.visual],
    options: [...task.options]
  }));
}

function loadAdminAuth() {
  try {
    return localStorage.getItem(STORAGE_KEYS.adminAuth) === "true";
  } catch (_error) {
    return false;
  }
}

function saveAdminAuth() {
  localStorage.setItem(STORAGE_KEYS.adminAuth, state.adminAuthenticated ? "true" : "false");
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    return raw ? JSON.parse(raw) : {};
  } catch (_error) {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state.progress));
}

function normalizeDifficulty(value) {
  if (value === "Старт" || value === "Уверенно" || value === "Сложно") {
    return value;
  }

  return "Старт";
}

function normalizeVisual(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTask(rawTask, sourceFallback = "manual") {
  if (!rawTask || typeof rawTask !== "object") {
    throw new Error("Каждая задача должна быть объектом.");
  }

  const title = String(rawTask.title || "").trim();
  const category = String(rawTask.category || "").trim();
  const prompt = String(rawTask.prompt || "").trim();
  const explanation = String(rawTask.explanation || "").trim();
  const visual = normalizeVisual(rawTask.visual || rawTask.sequence || rawTask.visualTokens || "");
  const options = Array.isArray(rawTask.options)
    ? rawTask.options.map((option) => String(option).trim()).filter(Boolean)
    : [];

  if (!title) {
    throw new Error("У задачи должно быть поле title.");
  }

  if (!category) {
    throw new Error(`У задачи "${title}" должно быть поле category.`);
  }

  if (!prompt) {
    throw new Error(`У задачи "${title}" должно быть поле prompt.`);
  }

  if (options.length < 2) {
    throw new Error(`У задачи "${title}" должно быть минимум два варианта ответа.`);
  }

  let answerIndex = null;

  if (typeof rawTask.answer === "number") {
    answerIndex = rawTask.answer;
  } else if (typeof rawTask.answerIndex === "number") {
    answerIndex = rawTask.answerIndex;
  } else if (typeof rawTask.correctOption === "number") {
    answerIndex = rawTask.correctOption;
  } else if (typeof rawTask.answer === "string") {
    answerIndex = options.findIndex((option) => option === rawTask.answer.trim());
  }

  if (answerIndex === null || answerIndex < 0 || answerIndex >= options.length) {
    throw new Error(`У задачи "${title}" не найден корректный индекс ответа.`);
  }

  return {
    id: String(rawTask.id || createId()),
    title,
    category,
    difficulty: normalizeDifficulty(rawTask.difficulty),
    prompt,
    visual,
    options,
    answer: answerIndex,
    explanation,
    source: rawTask.source || sourceFallback
  };
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks);

    if (!raw) {
      return cloneDefaultTasks();
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || !parsed.length) {
      return cloneDefaultTasks();
    }

    return parsed.map((task) => normalizeTask(task, task.source || "manual"));
  } catch (_error) {
    return cloneDefaultTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sourceLabel(source) {
  if (source === "manual") {
    return "Создано вручную";
  }

  if (source === "imported") {
    return "Импорт";
  }

  return "Демо";
}

function renderVisual(items) {
  const values = items.length ? items : ["Без визуальной строки"];

  return `
    <div class="visual-row">
      ${values.map((item) => `<span class="visual-chip">${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function setStatusBox(node, message, type = "neutral") {
  if (!node) {
    return;
  }

  node.textContent = message;
  node.className = "status-box";

  if (type === "success" || type === "error") {
    node.classList.add(type);
  }
}

function setAdminStatus(message, type = "neutral") {
  setStatusBox(adminStatus, message, type);
}

function setLoginStatus(message, type = "neutral") {
  setStatusBox(adminLoginStatus, message, type);
}

function getCategories() {
  return [...new Set(state.tasks.map((task) => task.category))].sort((left, right) =>
    left.localeCompare(right, "ru")
  );
}

function getMetricsSummary() {
  const total = state.tasks.length;
  const manual = state.tasks.filter((task) => task.source === "manual").length;
  const imported = state.tasks.filter((task) => task.source === "imported").length;
  const solved = state.tasks.filter((task) => state.progress[task.id]?.solved).length;
  const correct = state.tasks.filter((task) => state.progress[task.id]?.correct).length;
  const categories = getCategories().length;
  const accuracy = solved ? Math.round((correct / solved) * 100) : 0;

  return {
    total,
    manual,
    imported,
    solved,
    correct,
    categories,
    accuracy
  };
}

function setStat(name, value) {
  document.querySelectorAll(`[data-stat="${name}"]`).forEach((node) => {
    node.textContent = String(value);
  });
}

function renderGlobalChrome() {
  const label = state.adminAuthenticated ? "Админ в студии" : "Админ не вошёл";

  document.querySelectorAll("[data-auth-badge]").forEach((badge) => {
    badge.textContent = label;
    badge.classList.toggle("is-open", state.adminAuthenticated);
  });

  document.querySelectorAll("[data-logout-admin]").forEach((button) => {
    button.classList.toggle("hidden", !state.adminAuthenticated);
  });
}

function renderSharedStats() {
  const summary = getMetricsSummary();
  setStat("tasks-total", summary.total);
  setStat("categories-total", summary.categories);
  setStat("manual-total", summary.manual);
  setStat("imported-total", summary.imported);
  setStat("solved-total", summary.solved);
  setStat("correct-total", summary.correct);
  setStat("accuracy-rate", `${summary.accuracy}%`);
}

function renderLandingPreview() {
  if (!landingPreviewList) {
    return;
  }

  const previewTasks = state.tasks.slice(0, 3);

  if (!previewTasks.length) {
    landingPreviewList.innerHTML = `<div class="empty-state">В библиотеке пока нет задач.</div>`;
  } else {
    landingPreviewList.innerHTML = previewTasks
      .map(
        (task) => `
          <article class="task-teaser">
            <div class="meta-row">
              <span class="pill">${escapeHtml(task.category)}</span>
              <span class="pill muted">${escapeHtml(task.difficulty)}</span>
            </div>
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.prompt)}</p>
            ${renderVisual(task.visual)}
            <a class="text-link" href="student.html">Открыть в практике</a>
          </article>
        `
      )
      .join("");
  }

  if (landingActivityNote) {
    const summary = getMetricsSummary();

    landingActivityNote.textContent = summary.solved
      ? `Сейчас в библиотеке ${summary.total} задач в ${summary.categories} категориях. Ученик решил ${summary.solved}, точность ${summary.accuracy}%.`
      : `Сейчас в библиотеке ${summary.total} задач в ${summary.categories} категориях. Начните со страницы практики, чтобы собрать первый прогресс.`;
  }
}

function ensureAdminAuth() {
  if (state.adminAuthenticated) {
    return true;
  }

  setLoginStatus("Сначала войдите в админ-панель.", "error");
  adminLoginCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;
}

function renderAdminAccess() {
  if (!adminAuthView && !adminDashboardView) {
    return;
  }

  if (adminAuthView) {
    adminAuthView.classList.toggle("hidden", state.adminAuthenticated);
  }

  if (adminDashboardView) {
    adminDashboardView.classList.toggle("hidden", !state.adminAuthenticated);
  }

  if (!state.adminAuthenticated) {
    setAdminStatus("Войдите как администратор, чтобы управлять банком задач.");
    setLoginStatus("Используй демо-данные выше, чтобы открыть рабочую зону администратора.");
  }
}

function renderAdminMetrics() {
  if (!totalTasksCount || !manualTasksCount || !importedTasksCount) {
    return;
  }

  const summary = getMetricsSummary();
  totalTasksCount.textContent = String(summary.total);
  manualTasksCount.textContent = String(summary.manual);
  importedTasksCount.textContent = String(summary.imported);
}

function renderCategoryDatalist() {
  if (!categoryList) {
    return;
  }

  categoryList.innerHTML = getCategories()
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join("");
}

function getAdminFilteredTasks() {
  const query = state.adminSearch.trim().toLowerCase();

  if (!query) {
    return state.tasks;
  }

  return state.tasks.filter((task) =>
    [task.title, task.prompt, task.category].some((value) =>
      value.toLowerCase().includes(query)
    )
  );
}

function renderAdminTaskList() {
  if (!adminTaskList) {
    return;
  }

  const filteredTasks = getAdminFilteredTasks();

  if (!filteredTasks.length) {
    adminTaskList.innerHTML = `<div class="empty-state">По этому запросу задач пока нет.</div>`;
    return;
  }

  adminTaskList.innerHTML = filteredTasks
    .map(
      (task) => `
        <article class="bank-item" data-task-id="${escapeHtml(task.id)}">
          <div class="section-head">
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.prompt)}</p>
          </div>
          <div class="meta-row">
            <span class="pill">${escapeHtml(task.category)}</span>
            <span class="pill muted">${escapeHtml(task.difficulty)}</span>
            <span class="source-pill">${escapeHtml(sourceLabel(task.source))}</span>
          </div>
          <div class="bank-footer">
            <small class="meta-note">${task.options.length} варианта ответа</small>
            <div class="bank-actions">
              <button type="button" data-action="edit">Редактировать</button>
              <button type="button" class="danger" data-action="delete">Удалить</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function resetForm() {
  state.editingTaskId = "";

  if (!taskForm) {
    return;
  }

  taskIdInput.value = "";
  taskForm.reset();
  difficultyInput.value = "Старт";
  answerInput.value = "0";
  formTitle.textContent = "Новая задача";
  saveButton.textContent = "Сохранить задачу";
}

function fillForm(taskId) {
  if (!taskForm) {
    return;
  }

  const task = state.tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  state.editingTaskId = task.id;
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  categoryInput.value = task.category;
  difficultyInput.value = task.difficulty;
  visualInput.value = task.visual.join(", ");
  promptInput.value = task.prompt;
  explanationInput.value = task.explanation;
  answerInput.value = String(task.answer);

  optionInputs.forEach((input, index) => {
    if (input) {
      input.value = task.options[index] || "";
    }
  });

  formTitle.textContent = "Редактирование задачи";
  saveButton.textContent = "Обновить задачу";
  setAdminStatus(`Задача "${task.title}" загружена в форму.`, "success");
}

function renderStudentFilters() {
  if (!studentCategoryFilter || !studentDifficultyFilter) {
    return;
  }

  const categories = getCategories();
  const currentCategory = categories.includes(state.studentCategory) ? state.studentCategory : "all";
  state.studentCategory = currentCategory;

  studentCategoryFilter.innerHTML = `
    <option value="all">Все категории</option>
    ${categories
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join("")}
  `;

  studentCategoryFilter.value = state.studentCategory;
  studentDifficultyFilter.value = state.studentDifficulty;
}

function getStudentFilteredTasks() {
  return state.tasks.filter((task) => {
    const matchesSearch =
      !state.studentSearch ||
      [task.title, task.prompt, task.category].some((value) =>
        value.toLowerCase().includes(state.studentSearch.toLowerCase())
      );
    const matchesCategory =
      state.studentCategory === "all" || task.category === state.studentCategory;
    const matchesDifficulty =
      state.studentDifficulty === "all" || task.difficulty === state.studentDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
}

function ensureStudentSelection() {
  const filteredTasks = getStudentFilteredTasks();

  if (!filteredTasks.length) {
    state.selectedStudentTaskId = "";
    state.studentEvaluation = null;
    return;
  }

  const exists = filteredTasks.some((task) => task.id === state.selectedStudentTaskId);

  if (!exists) {
    state.selectedStudentTaskId = filteredTasks[0].id;
    state.studentEvaluation = null;
  }
}

function renderStudentMetrics() {
  if (!studentTotalCount || !studentSolvedCount || !studentCorrectCount) {
    return;
  }

  const summary = getMetricsSummary();
  studentTotalCount.textContent = String(summary.total);
  studentSolvedCount.textContent = String(summary.solved);
  studentCorrectCount.textContent = String(summary.correct);
}

function renderStudentTaskList() {
  if (!studentTaskList) {
    return;
  }

  const filteredTasks = getStudentFilteredTasks();

  if (!filteredTasks.length) {
    studentTaskList.innerHTML = `<div class="empty-state">По текущим фильтрам задач пока нет.</div>`;
    return;
  }

  studentTaskList.innerHTML = filteredTasks
    .map((task) => {
      const progress = state.progress[task.id];
      const progressLabel = progress?.correct
        ? "Решено верно"
        : progress?.solved
          ? "Есть попытка"
          : "Новая задача";
      const progressClass = progress?.correct ? "progress-chip good" : "progress-chip";

      return `
        <article class="library-item ${task.id === state.selectedStudentTaskId ? "is-active" : ""}" data-task-id="${escapeHtml(task.id)}">
          <div class="library-item-head">
            <div class="section-head">
              <h3>${escapeHtml(task.title)}</h3>
              <small>${escapeHtml(task.prompt)}</small>
            </div>
            <span class="${progressClass}">${escapeHtml(progressLabel)}</span>
          </div>
          <div class="meta-row">
            <span class="pill">${escapeHtml(task.category)}</span>
            <span class="pill muted">${escapeHtml(task.difficulty)}</span>
          </div>
          <button type="button" data-action="open">Открыть задачу</button>
        </article>
      `;
    })
    .join("");
}

function getSelectedTask() {
  return state.tasks.find((task) => task.id === state.selectedStudentTaskId) || null;
}

function resetStudentEvaluation() {
  state.studentEvaluation = null;
}

function renderStudentPlayer() {
  if (
    !studentTaskCategory ||
    !studentTaskDifficulty ||
    !studentTaskSource ||
    !studentTaskTitle ||
    !studentTaskPrompt ||
    !studentTaskVisual ||
    !studentTaskOptions ||
    !studentFeedback ||
    !studentFeedbackTitle ||
    !studentFeedbackText ||
    !studentResetAnswer ||
    !studentNextTask
  ) {
    return;
  }

  const task = getSelectedTask();

  if (!task) {
    studentTaskCategory.textContent = "Категория";
    studentTaskDifficulty.textContent = "Сложность";
    studentTaskSource.textContent = "Выберите задачу из списка слева.";
    studentTaskTitle.textContent = "Здесь появится задание";
    studentTaskPrompt.textContent =
      "Администратор может добавить новую задачу вручную или импортировать целый набор, и всё сразу появится в этой панели.";
    studentTaskVisual.innerHTML = `<div class="empty-state">Нет выбранной задачи.</div>`;
    studentTaskOptions.innerHTML = "";
    studentFeedback.className = "feedback-panel";
    studentFeedbackTitle.textContent = "Режим ожидания";
    studentFeedbackText.textContent = "Выбери задачу и нажми на один из вариантов ответа.";
    studentResetAnswer.disabled = true;
    studentNextTask.disabled = true;
    return;
  }

  studentTaskCategory.textContent = task.category;
  studentTaskDifficulty.textContent = task.difficulty;
  studentTaskSource.textContent = sourceLabel(task.source);
  studentTaskTitle.textContent = task.title;
  studentTaskPrompt.textContent = task.prompt;
  studentTaskVisual.innerHTML = renderVisual(task.visual);
  studentResetAnswer.disabled = false;
  studentNextTask.disabled = getStudentFilteredTasks().length <= 1;

  studentTaskOptions.innerHTML = task.options
    .map((option, index) => {
      let className = "task-option";

      if (state.studentEvaluation) {
        if (index === task.answer) {
          className += " correct";
        } else if (index === state.studentEvaluation.chosenIndex) {
          className += " wrong";
        }
      }

      return `
        <button
          type="button"
          class="${className}"
          data-option-index="${index}"
          ${state.studentEvaluation ? "disabled" : ""}
        >
          ${escapeHtml(option)}
        </button>
      `;
    })
    .join("");

  studentFeedback.className = "feedback-panel";

  if (!state.studentEvaluation) {
    studentFeedbackTitle.textContent = "Выбери ответ";
    studentFeedbackText.textContent = "После ответа здесь появится короткое объяснение.";
    return;
  }

  if (state.studentEvaluation.correct) {
    studentFeedback.classList.add("success");
    studentFeedbackTitle.textContent = "Верно";
  } else {
    studentFeedback.classList.add("error");
    studentFeedbackTitle.textContent = "Нужно ещё подумать";
  }

  studentFeedbackText.textContent =
    task.explanation || "Пояснение для этой задачи пока не добавлено.";
}

function renderAll() {
  renderGlobalChrome();
  renderSharedStats();
  renderLandingPreview();
  renderAdminAccess();
  renderAdminMetrics();
  renderCategoryDatalist();
  renderAdminTaskList();
  renderStudentFilters();
  ensureStudentSelection();
  renderStudentMetrics();
  renderStudentTaskList();
  renderStudentPlayer();
}

function createTaskFromForm() {
  const options = optionInputs.map((input) => input?.value.trim() || "").filter(Boolean);
  const answer = Number(answerInput.value);

  if (options.length < 2) {
    throw new Error("Нужно заполнить минимум два варианта ответа.");
  }

  if (answer >= options.length) {
    throw new Error("Правильный вариант указывает на пустой ответ.");
  }

  const existingTask = state.tasks.find((task) => task.id === state.editingTaskId);
  const source = existingTask?.source || "manual";

  return normalizeTask(
    {
      id: state.editingTaskId || createId(),
      title: titleInput.value.trim(),
      category: categoryInput.value.trim(),
      difficulty: difficultyInput.value,
      prompt: promptInput.value.trim(),
      visual: visualInput.value.trim(),
      options,
      answer,
      explanation: explanationInput.value.trim(),
      source
    },
    source
  );
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!ensureAdminAuth()) {
    return;
  }

  try {
    const task = createTaskFromForm();
    const existingIndex = state.tasks.findIndex((item) => item.id === task.id);

    if (existingIndex >= 0) {
      state.tasks[existingIndex] = task;
      setAdminStatus(`Задача "${task.title}" обновлена.`, "success");
    } else {
      state.tasks.unshift(task);
      setAdminStatus(`Задача "${task.title}" создана.`, "success");
    }

    saveTasks();
    resetForm();
    renderAll();
  } catch (error) {
    setAdminStatus(error.message, "error");
  }
}

function handleAdminTaskAction(event) {
  const button = event.target.closest("button");

  if (!button || !ensureAdminAuth()) {
    return;
  }

  const container = event.target.closest("[data-task-id]");
  const taskId = container?.dataset.taskId;

  if (!taskId) {
    return;
  }

  if (button.dataset.action === "edit") {
    fillForm(taskId);
    return;
  }

  if (button.dataset.action === "delete") {
    const task = state.tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    const confirmed = window.confirm(`Удалить задачу "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    state.tasks = state.tasks.filter((item) => item.id !== taskId);
    delete state.progress[taskId];
    saveTasks();
    saveProgress();

    if (state.selectedStudentTaskId === taskId) {
      state.selectedStudentTaskId = "";
      state.studentEvaluation = null;
    }

    if (state.editingTaskId === taskId) {
      resetForm();
    }

    setAdminStatus(`Задача "${task.title}" удалена.`, "success");
    renderAll();
  }
}

async function handleUpload(event) {
  if (!ensureAdminAuth()) {
    if (taskUpload) {
      taskUpload.value = "";
    }

    return;
  }

  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const rawTasks = Array.isArray(parsed) ? parsed : parsed.tasks;

    if (!Array.isArray(rawTasks) || !rawTasks.length) {
      throw new Error("Файл должен содержать массив задач.");
    }

    const importedTasks = rawTasks.map((task) => normalizeTask(task, "imported"));
    state.tasks = [...importedTasks, ...state.tasks];
    saveTasks();
    renderAll();
    setAdminStatus(`Импортировано задач: ${importedTasks.length}.`, "success");
  } catch (error) {
    setAdminStatus(error.message, "error");
  } finally {
    event.target.value = "";
  }
}

function handleExport() {
  if (!ensureAdminAuth()) {
    return;
  }

  const payload = state.tasks.map((task) => ({
    title: task.title,
    category: task.category,
    difficulty: task.difficulty,
    prompt: task.prompt,
    visual: task.visual,
    options: task.options,
    answer: task.answer,
    explanation: task.explanation,
    source: task.source
  }));

  const blob = new Blob([JSON.stringify({ tasks: payload }, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "logic-spark-tasks.json";
  link.click();
  URL.revokeObjectURL(url);

  setAdminStatus("Банк задач выгружен в JSON.", "success");
}

function handleRestoreDemo() {
  if (!ensureAdminAuth()) {
    return;
  }

  const confirmed = window.confirm("Сбросить банк задач к демо-набору?");

  if (!confirmed) {
    return;
  }

  state.tasks = cloneDefaultTasks();
  state.progress = {};
  state.selectedStudentTaskId = "";
  state.studentEvaluation = null;
  saveTasks();
  saveProgress();
  resetForm();
  renderAll();
  setAdminStatus("Демо-набор восстановлен.", "success");
}

function openStudentTask(taskId) {
  state.selectedStudentTaskId = taskId;
  resetStudentEvaluation();
  renderStudentTaskList();
  renderStudentPlayer();
}

function handleStudentTaskList(event) {
  const button = event.target.closest("button");

  if (!button || button.dataset.action !== "open") {
    return;
  }

  const container = event.target.closest("[data-task-id]");
  const taskId = container?.dataset.taskId;

  if (taskId) {
    openStudentTask(taskId);
  }
}

function recordStudentProgress(task, isCorrect) {
  const previous = state.progress[task.id] || {
    attempts: 0,
    solved: false,
    correct: false
  };

  state.progress[task.id] = {
    attempts: previous.attempts + 1,
    solved: true,
    correct: previous.correct || isCorrect
  };

  saveProgress();
}

function handleStudentAnswer(event) {
  const button = event.target.closest("[data-option-index]");

  if (!button || state.studentEvaluation) {
    return;
  }

  const task = getSelectedTask();

  if (!task) {
    return;
  }

  const chosenIndex = Number(button.dataset.optionIndex);
  const isCorrect = chosenIndex === task.answer;

  state.studentEvaluation = {
    chosenIndex,
    correct: isCorrect
  };

  recordStudentProgress(task, isCorrect);
  renderSharedStats();
  renderStudentMetrics();
  renderStudentTaskList();
  renderStudentPlayer();
}

function handleNextStudentTask() {
  const filteredTasks = getStudentFilteredTasks();

  if (!filteredTasks.length) {
    return;
  }

  const currentIndex = filteredTasks.findIndex((task) => task.id === state.selectedStudentTaskId);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % filteredTasks.length : 0;

  state.selectedStudentTaskId = filteredTasks[nextIndex].id;
  resetStudentEvaluation();
  renderStudentTaskList();
  renderStudentPlayer();
}

function handleAdminLogin(event) {
  event.preventDefault();

  const email = adminEmailInput.value.trim().toLowerCase();
  const password = adminPasswordInput.value;

  if (email !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
    setLoginStatus("Неверный email или пароль для демо-входа.", "error");
    return;
  }

  state.adminAuthenticated = true;
  saveAdminAuth();
  adminPasswordInput.value = "";
  setLoginStatus("Вход выполнен. Студия администратора открыта.", "success");
  setAdminStatus("Добро пожаловать в студию управления задачами.", "success");
  renderAll();
}

function handleAdminLogout() {
  state.adminAuthenticated = false;
  saveAdminAuth();

  if (adminLoginForm) {
    adminLoginForm.reset();
  }

  resetForm();
  renderAll();
  setLoginStatus("Вы вышли из студии. Чтобы вернуться, снова выполните вход.");
}

function syncFromStorageEvent(event) {
  if (!Object.values(STORAGE_KEYS).includes(event.key)) {
    return;
  }

  state.adminAuthenticated = loadAdminAuth();
  state.tasks = loadTasks();
  state.progress = loadProgress();

  if (state.editingTaskId && !state.tasks.some((task) => task.id === state.editingTaskId)) {
    resetForm();
  }

  renderAll();
}

function attachEventListeners() {
  document.querySelectorAll("[data-logout-admin]").forEach((button) => {
    button.addEventListener("click", handleAdminLogout);
  });

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", handleAdminLogin);
  }

  if (taskForm) {
    taskForm.addEventListener("submit", handleFormSubmit);
  }

  if (resetFormButton) {
    resetFormButton.addEventListener("click", () => {
      if (!ensureAdminAuth()) {
        return;
      }

      resetForm();
      setAdminStatus("Форма очищена.");
    });
  }

  if (adminSearch) {
    adminSearch.addEventListener("input", () => {
      state.adminSearch = adminSearch.value;
      renderAdminTaskList();
    });
  }

  if (adminTaskList) {
    adminTaskList.addEventListener("click", handleAdminTaskAction);
  }

  if (taskUpload) {
    taskUpload.addEventListener("change", handleUpload);
  }

  if (exportButton) {
    exportButton.addEventListener("click", handleExport);
  }

  if (restoreDemoButton) {
    restoreDemoButton.addEventListener("click", handleRestoreDemo);
  }

  if (studentSearch) {
    studentSearch.addEventListener("input", () => {
      state.studentSearch = studentSearch.value.trim();
      renderAll();
    });
  }

  if (studentCategoryFilter) {
    studentCategoryFilter.addEventListener("change", () => {
      state.studentCategory = studentCategoryFilter.value;
      renderAll();
    });
  }

  if (studentDifficultyFilter) {
    studentDifficultyFilter.addEventListener("change", () => {
      state.studentDifficulty = studentDifficultyFilter.value;
      renderAll();
    });
  }

  if (studentTaskList) {
    studentTaskList.addEventListener("click", handleStudentTaskList);
  }

  if (studentTaskOptions) {
    studentTaskOptions.addEventListener("click", handleStudentAnswer);
  }

  if (studentResetAnswer) {
    studentResetAnswer.addEventListener("click", () => {
      resetStudentEvaluation();
      renderStudentPlayer();
    });
  }

  if (studentNextTask) {
    studentNextTask.addEventListener("click", handleNextStudentTask);
  }

  window.addEventListener("storage", syncFromStorageEvent);
}

resetForm();
renderAll();
attachEventListeners();
