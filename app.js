/**
 * RiskGuard AI Investment Warning Service - MVP
 * Written in Vanilla JavaScript
 */

// 1. Predefined Base Mock Assets (will have a slight daily variance applied)
const baseMockAssets = {
  "홈플러스": {
    name: "홈플러스 채권",
    score: 85,
    debtRatio: 90,
    cashFlow: 82,
    credit: 70,
    interestCoverage: 88,
    summary: "홈플러스 채권은 최근 현금흐름 악화와 높은 부채비율 때문에 위험도가 높습니다. 단기 상환 능력이 부족할 가능성이 있으므로 신중한 접근이 필요합니다."
  },
  "JTBC": {
    name: "JTBC 주식/회사채",
    score: 80,
    debtRatio: 84,
    cashFlow: 82,
    credit: 75,
    interestCoverage: 80,
    summary: "JTBC는 최근 방송 광고 매출 감소 및 현금 유동성 악화, 높은 부채비율 부담으로 인해 위험지수가 높게 평가되었습니다. 재무 완충력이 부족하므로 각별한 주의가 요구됩니다."
  },
  "한국전력": {
    name: "한국전력 주식/채권",
    score: 55,
    debtRatio: 60,
    cashFlow: 52,
    credit: 48,
    interestCoverage: 58,
    summary: "한국전력은 원자재 가격 변동 및 전기요금 규제로 재무 부담이 증가하고 있으나, 공기업으로서의 높은 국가 신용 등급 및 정부 지원 가능성을 감안할 때 현금 위협 수준은 비교적 통제 가능합니다."
  },
  "삼성전자": {
    name: "삼성전자 주식",
    score: 18,
    debtRatio: 22,
    cashFlow: 15,
    credit: 10,
    interestCoverage: 18,
    summary: "삼성전자는 재무구조가 매우 안정적입니다. 충분한 여유 현금을 보유하고 있으며, 빚을 갚거나 이자를 지급할 수 있는 능력이 최상위 수준입니다."
  },
  "카카오": {
    name: "카카오 주식",
    score: 52,
    debtRatio: 50,
    cashFlow: 55,
    credit: 45,
    interestCoverage: 48,
    summary: "카카오는 양호한 사업적 기반을 지녔으나 최근 현금 부족 우려와 빚 비중(부채비율)이 다소 상승했습니다. 단기적인 재무 지표에 주의가 필요한 구간입니다."
  },
  "현대자동차": {
    name: "현대자동차 주식",
    score: 25,
    debtRatio: 30,
    cashFlow: 22,
    credit: 20,
    interestCoverage: 22,
    summary: "현대자동차는 견조한 글로벌 영업이익에 기반하여 현금흐름이 원활하며 빚 상환 능력이 매우 높습니다. 재무적 위험 요인이 낮게 진단됩니다."
  },
  "SK하이닉스": {
    name: "SK하이닉스 주식",
    score: 40,
    debtRatio: 42,
    cashFlow: 48,
    credit: 35,
    interestCoverage: 38,
    summary: "SK하이닉스는 반도체 경기 변동에 따라 영업 현금흐름의 유동성이 큽니다. 현재 부채 상태는 무난하나, 업황에 따른 이자 부담 변동성에 유의하십시오."
  },
  "LG에너지솔루션": {
    name: "LG에너지솔루션 주식",
    score: 32,
    debtRatio: 35,
    cashFlow: 38,
    credit: 28,
    interestCoverage: 32,
    summary: "LG에너지솔루션은 신산업 설비 투자가 활발하여 빚이 다소 증가하고 있으나, 매출 성장세 및 대기업 계열 신용도 지원으로 전반적인 리스크는 관리 가능한 범위 내에 있습니다."
  },
  "NAVER": {
    name: "NAVER 주식",
    score: 22,
    debtRatio: 25,
    cashFlow: 20,
    credit: 15,
    interestCoverage: 20,
    summary: "NAVER는 플랫폼 지배력을 기반으로 한 견고한 영업 현금 유입을 유지하고 있어 부채 상환이나 금융 리스크 발생 가능성이 매우 낮습니다."
  }
};

// 2. Candidate Pool for Today's Top 10 (total 41 companies/assets)
const candidateCompanies = [
  "삼성전자", "SK하이닉스", "LG에너지솔루션", "삼성바이오로직스", "현대자동차",
  "기아", "셀트리온", "카카오", "NAVER", "POSCO홀딩스",
  "LG화학", "삼성SDI", "KB금융", "신한지주", "포스코퓨처엠",
  "SK이노베이션", "한국전력", "카카오뱅크", "삼성물산", "현대모비스",
  "LG전자", "아모레퍼시픽", "대한항공", "SK", "LG",
  "두산에너빌리티", "HMM", "삼성생명", "하나금융지주", "메리츠금융지주",
  "KT&G", "HD현대중공업", "크래프톤", "삼성화재", "SK텔레콤",
  "고려아연", "한화오션", "에코프로머티", "넷마블", "홈플러스",
  "JTBC"
];

// 3. Helper Functions for Hashing & Seeding
function getDailyDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 4. Seeded Asset Generator (incorporating Date Seed)
function getSeededAsset(name) {
  const dateStr = getDailyDateString();
  const seed = hashCode(name + dateStr);

  // Check if predefined in baseMockAssets
  let base = baseMockAssets[name];
  if (!base) {
    // Check if substring matches predefined keys (e.g. "삼성전자 주식" matching "삼성전자")
    for (const key in baseMockAssets) {
      if (name.includes(key)) {
        base = baseMockAssets[key];
        break;
      }
    }
  }

  if (base) {
    // Predefined asset: Add daily minor variance (+/- 8 points)
    const dailyVariance = -8 + Math.floor(seededRandom(seed) * 16);
    const finalScore = Math.max(10, Math.min(99, base.score + dailyVariance));
    
    // Apply same variance to factors
    const applyVar = (val) => Math.max(10, Math.min(99, val + dailyVariance));
    
    return {
      name: base.name,
      score: finalScore,
      debtRatio: applyVar(base.debtRatio),
      cashFlow: applyVar(base.cashFlow),
      credit: applyVar(base.credit),
      interestCoverage: applyVar(base.interestCoverage),
      summary: base.summary
    };
  } else {
    // Purely generated asset: Generate full profile dynamically based on name + date
    const score = Math.floor(15 + seededRandom(seed) * 77);
    
    const getSubScore = (offset) => {
      const variance = -12 + Math.floor(seededRandom(seed + offset) * 24);
      return Math.max(10, Math.min(99, score + variance));
    };
    
    const debtRatio = getSubScore(1);
    const cashFlow = getSubScore(2);
    const credit = getSubScore(3);
    const interestCoverage = getSubScore(4);
    
    let summary = "";
    if (score >= 81) {
      summary = `${name}은(는) 오늘자 기준으로 빚 상환 능력이 급격히 떨어지고 영업 현금이 말라 매우 높은 재무 위험군에 해당합니다. 자금조달 압박 우려가 있으므로 투자에 유의하십시오.`;
    } else if (score >= 61) {
      summary = `${name}은(는) 오늘자 분석 결과 부채 비율 대비 유입되는 현금 흐름이 정체되어 주의 신호가 켜졌습니다. 이자 상환 부담을 지속적으로 확인해야 합니다.`;
    } else if (score >= 31) {
      summary = `${name}은(는) 전반적으로 평이한 안전도를 보이고 있으나, 미세한 신용도 정체 및 현금 흐름 부담이 감지되어 중기적인 위험 모니터링이 필요합니다.`;
    } else {
      summary = `${name}은(는) 오늘자 분석 결과 매우 튼튼한 재무 건전성을 확보하고 있습니다. 빚이 낮고 융통할 수 있는 자금이 충분해 리스크가 희박합니다.`;
    }
    
    return {
      name: name.endsWith("주식") || name.endsWith("채권") || name.endsWith("회사채") ? name : `${name} 주식`,
      score,
      debtRatio,
      cashFlow,
      credit,
      interestCoverage,
      summary
    };
  }
}

// 5. Risk Level Config helper
function calculateRiskLevel(score) {
  if (score >= 81) {
    return { label: "DANGER", color: "#DC2626", text: "매우 위험" };
  } else if (score >= 61) {
    return { label: "RISK", color: "#EA580C", text: "위험" }; 
  } else if (score >= 31) {
    return { label: "CAUTION", color: "#F59E0B", text: "주의" };
  } else {
    return { label: "SAFE", color: "#16A34A", text: "안전" };
  }
}

// 6. UI Helpers
function showLoading() {
  document.getElementById("loading-overlay").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading-overlay").classList.add("hidden");
}

// Get Risk text level for breakdown scores
function getBreakdownStatus(score) {
  if (score >= 81) {
    return { text: "매우 위험", color: "#DC2626", bg: "#FEF2F2" };
  } else if (score >= 61) {
    return { text: "위험", color: "#EA580C", bg: "#FFF7ED" };
  } else if (score >= 31) {
    return { text: "주의", color: "#D97706", bg: "#FEF3C7" };
  } else {
    return { text: "안전", color: "#16A34A", bg: "#F0FDF4" };
  }
}

// 7. Render Result Screen
function renderResult(data) {
  // Update Asset Name
  document.getElementById("text-asset-name").textContent = data.name;

  // Update Score
  const scoreVal = document.getElementById("text-risk-score");
  scoreVal.textContent = data.score;
  
  // Animate Gauge SVG Circle
  const fillCircle = document.getElementById("gauge-fill-circle");
  const riskInfo = calculateRiskLevel(data.score);
  
  // Set stroke color based on risk level
  fillCircle.style.stroke = riskInfo.color;
  
  // Calculation of dashoffset: 2 * PI * r = 2 * 3.14159 * 80 = 502
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (data.score / 100) * circumference;
  
  // Trigger offset transition slightly after layout display
  setTimeout(() => {
    fillCircle.style.strokeDashoffset = offset;
  }, 50);

  // Update Badge
  const badge = document.getElementById("badge-risk-level");
  badge.textContent = riskInfo.label;
  badge.style.backgroundColor = riskInfo.color;

  // Update Summary Text
  document.getElementById("text-ai-summary").textContent = data.summary;

  // Render Breakdown Grid (using document.createElement to ensure safe rendering)
  const breakdownContainer = document.getElementById("grid-breakdown-container");
  breakdownContainer.innerHTML = ""; // Clear old cards

  const factors = [
    { label: "부채비율", desc: "회사에 빚이 얼마나 많은지", score: data.debtRatio },
    { label: "현금흐름", desc: "영업을 통한 실제 현금 수입 상태", score: data.cashFlow },
    { label: "신용등급", desc: "채무를 약속대로 이행할 신용 수준", score: data.credit },
    { label: "이자 상환 능력", desc: "번 돈으로 이자를 충분히 감당하는지", score: data.interestCoverage }
  ];

  factors.forEach(factor => {
    const statusInfo = getBreakdownStatus(factor.score);
    
    // Create card element
    const card = document.createElement("div");
    card.className = "card-breakdown";
    
    // Create inner DOM
    const infoDiv = document.createElement("div");
    infoDiv.className = "breakdown-info";
    
    const labelSpan = document.createElement("span");
    labelSpan.className = "breakdown-label";
    labelSpan.textContent = factor.label;
    
    const descSpan = document.createElement("span");
    descSpan.className = "breakdown-desc";
    descSpan.textContent = factor.desc;
    
    infoDiv.appendChild(labelSpan);
    infoDiv.appendChild(descSpan);
    
    const badgeGroup = document.createElement("div");
    badgeGroup.className = "breakdown-badge-group";
    
    const scoreSpan = document.createElement("span");
    scoreSpan.className = "breakdown-score";
    scoreSpan.textContent = `${factor.score}점`;
    
    const statusSpan = document.createElement("span");
    statusSpan.className = "breakdown-status";
    statusSpan.textContent = statusInfo.text;
    statusSpan.style.color = statusInfo.color;
    statusSpan.style.backgroundColor = statusInfo.bg;
    
    badgeGroup.appendChild(scoreSpan);
    badgeGroup.appendChild(statusSpan);
    
    card.appendChild(infoDiv);
    card.appendChild(badgeGroup);
    
    breakdownContainer.appendChild(card);
  });
}

// 8. Main Search Action
function searchAsset() {
  const searchInput = document.getElementById("input-search");
  const query = searchInput.value.trim();

  if (!query) {
    alert("분석할 주식, 채권 또는 회사명을 입력해 주세요.");
    return;
  }

  showLoading();

  // Simulate 1s Loading / AI Analysis
  setTimeout(() => {
    hideLoading();

    let matchedAsset = null;
    if (query.length >= 2) {
      // Find asset using seeded generator (combines base profile matching + dynamic fallback)
      matchedAsset = getSeededAsset(query);
    }

    // Toggle screen views
    document.getElementById("screen-landing").classList.add("hidden");
    
    if (matchedAsset) {
      document.getElementById("screen-not-found").classList.add("hidden");
      document.getElementById("screen-result").classList.remove("hidden");
      renderResult(matchedAsset);
    } else {
      document.getElementById("screen-result").classList.add("hidden");
      document.getElementById("screen-not-found").classList.remove("hidden");
    }

    // Scroll to top of window to show results cleanly
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, 1000);
}

// 9. Render Daily Top 10 Risk Assets List
function renderDailyTop10() {
  const listContainer = document.getElementById("top-risk-list-container");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  // 1. Calculate scores for all candidates today
  const scoredList = candidateCompanies.map(name => {
    const asset = getSeededAsset(name);
    return { name, score: asset.score };
  });

  // 2. Sort by score descending
  scoredList.sort((a, b) => b.score - a.score);

  // 3. Take Top 10
  const top10 = scoredList.slice(0, 10);

  // 4. Render elements safely
  top10.forEach((item, index) => {
    const rank = index + 1;
    const riskInfo = calculateRiskLevel(item.score);

    const itemDiv = document.createElement("div");
    itemDiv.className = "top-risk-item";
    itemDiv.setAttribute("role", "button");
    itemDiv.setAttribute("aria-label", `${rank}위: ${item.name}, 위험 점수 ${item.score}점`);

    const leftDiv = document.createElement("div");
    leftDiv.className = "top-risk-item-left";

    const rankSpan = document.createElement("span");
    rankSpan.className = `top-risk-rank rank-${rank}`;
    rankSpan.textContent = rank;

    const nameSpan = document.createElement("span");
    nameSpan.className = "top-risk-name";
    nameSpan.textContent = item.name;

    leftDiv.appendChild(rankSpan);
    leftDiv.appendChild(nameSpan);

    const rightDiv = document.createElement("div");
    rightDiv.className = "top-risk-item-right";

    const scoreSpan = document.createElement("span");
    scoreSpan.className = "top-risk-score-val";
    scoreSpan.textContent = `${item.score}점`;

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "top-risk-badge";
    badgeSpan.textContent = riskInfo.label;
    badgeSpan.style.backgroundColor = riskInfo.bg || "rgba(0, 0, 0, 0.05)";
    badgeSpan.style.color = riskInfo.color;
    badgeSpan.style.border = `1px solid ${riskInfo.color}`;

    rightDiv.appendChild(scoreSpan);
    rightDiv.appendChild(badgeSpan);

    itemDiv.appendChild(leftDiv);
    itemDiv.appendChild(rightDiv);

    // Click handler to trigger search for this company
    itemDiv.addEventListener("click", () => {
      document.getElementById("input-search").value = item.name;
      searchAsset();
    });

    listContainer.appendChild(itemDiv);
  });
}

// 10. Navigation Functions
function navigateToHome() {
  // Clear search input
  document.getElementById("input-search").value = "";
  
  // Switch visibility
  document.getElementById("screen-result").classList.add("hidden");
  document.getElementById("screen-not-found").classList.add("hidden");
  document.getElementById("screen-landing").classList.remove("hidden");

  // Reset gauge offset
  const fillCircle = document.getElementById("gauge-fill-circle");
  fillCircle.style.strokeDashoffset = 502;

  // Refresh Top 10 list on navigation home
  renderDailyTop10();
}

// 11. Modal Control
function toggleAboutModal(show) {
  const modal = document.getElementById("modal-about");
  if (show) {
    modal.classList.remove("hidden");
    document.getElementById("btn-close-modal").focus();
  } else {
    modal.classList.add("hidden");
    document.getElementById("btn-about").focus();
  }
}

// 12. Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initial render of Daily Top 10
  renderDailyTop10();

  // Search button click
  document.getElementById("btn-search-submit").addEventListener("click", searchAsset);

  // Search input Enter key press
  document.getElementById("input-search").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchAsset();
    }
  });

  // Hero CTA scrolls down to search box
  document.getElementById("btn-hero-cta").addEventListener("click", () => {
    const searchSection = document.getElementById("search-section");
    searchSection.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("input-search").focus();
  });

  // Logo home navigation
  document.getElementById("logo-home").addEventListener("click", (e) => {
    e.preventDefault();
    navigateToHome();
  });

  // Back to home button on result page
  document.getElementById("btn-back-home").addEventListener("click", navigateToHome);

  // Back to home button on not-found page
  document.getElementById("btn-not-found-back").addEventListener("click", navigateToHome);

  // Quick recommend tags click
  const tagBtns = document.querySelectorAll(".tag-btn");
  tagBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-value");
      document.getElementById("input-search").value = val;
      searchAsset();
    });
  });

  // About Modal Toggles
  document.getElementById("btn-about").addEventListener("click", () => toggleAboutModal(true));
  document.getElementById("btn-close-modal").addEventListener("click", () => toggleAboutModal(false));

  // Close modal when clicking background overlay
  document.getElementById("modal-about").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-about")) {
      toggleAboutModal(false);
    }
  });

  // Keyboard accessibility: ESC key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("modal-about");
      if (!modal.classList.contains("hidden")) {
        toggleAboutModal(false);
      }
    }
  });
});
