const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs');
const trackFiles = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    categoryId: 1,
    trackCode: 'TRK-01',
    categoryCode: 'PULMONARY',
    categoryName: '호흡기계·폐질환 케어',
    file: 'TRACK1_PULMONARY_CARE_CURRICULUM_AND_EXAMS.md',
    qualificationName: '환자 질환별 전문간병사 (호흡기계·폐질환자)',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    categoryId: 2,
    trackCode: 'TRK-02',
    categoryCode: 'DEMENTIA',
    categoryName: '인지·정신·치매환자 케어',
    file: 'TRACK2_DEMENTIA_CARE_CURRICULUM_AND_EXAMS.md',
    qualificationName: '환자 질환별 전문간병사 (인지·정신·치매)',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    categoryId: 3,
    trackCode: 'TRK-03',
    categoryCode: 'MUSCULOSKELETAL',
    categoryName: '근골격계질환 및 수술 후 재활 케어',
    file: 'TRACK3_MUSCULOSKELETAL_CARE_CURRICULUM_AND_EXAMS.md',
    qualificationName: '환자 질환별 전문간병사 (근골격계·재활)',
  },
];

function parseQuestions(sectionText, trackCode, examType, categoryId) {
  const questions = [];
  // 각 문항은 ### [문항 N] 으로 시작
  const qBlocks = sectionText.split(/(?=###\s*\[문항\s*\d+\])/g).filter(b => b.trim().startsWith('###'));

  for (const block of qBlocks) {
    const titleMatch = block.match(/###\s*\[문항\s*(\d+)\]\s*([^\n\r]+)/);
    if (!titleMatch) continue;

    const qNum = parseInt(titleMatch[1], 10);
    const title = titleMatch[2].trim();

    // 선택지 추출: ①, ②, ③, ④
    const optMatches = [...block.matchAll(/([①②③④])\s*([^\n\r]+)/g)];
    const options = optMatches.map(m => {
      const numMap = { '①': 1, '②': 2, '③': 3, '④': 4 };
      return {
        no: numMap[m[1]] || 1,
        text: m[2].trim(),
      };
    });

    // 정답 추출: - **정답**: ② 또는 ②
    const answerMatch = block.match(/-\s*\*\*정답\*\*:\s*([①②③④\d])/);
    let correctAnswer = 1;
    if (answerMatch) {
      const numMap = { '①': 1, '②': 2, '③': 3, '④': 4 };
      correctAnswer = numMap[answerMatch[1]] || parseInt(answerMatch[1], 10) || 1;
    }

    // 해설 추출: - **해설**: ...
    const expMatch = block.match(/-\s*\*\*해설\*\*:\s*([^\n\r]+(?:\n[^\n\r#]+)*)/);
    const explanation = expMatch ? expMatch[1].trim() : '';

    const subjectCode = `${trackCode}-${examType}`;

    questions.push({
      questionNumber: qNum,
      title,
      options,
      correctAnswer: String(correctAnswer),
      explanation,
      points: 20,
      subjectCode,
      categoryId,
      terminologyTags: [trackCode, examType === 'MOCK' ? '실전모의고사' : '최종평가시험'],
    });
  }

  return questions;
}

function parseTrackFile(trackInfo) {
  const fullPath = path.join(docsDir, trackInfo.file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // 과정명, 영상 제목, 영상 URL, 대상 질환 추출
  const titleMatch = content.match(/-\s*\*\*과정명\*\*:\s*([^\n\r]+)/);
  const title = titleMatch ? titleMatch[1].trim() : trackInfo.qualificationName;

  const videoMatch = content.match(/-\s*\*\*분석 대상 영상\*\*:\s*\[([^\]]+)\]\(([^)]+)\)/);
  const videoTitle = videoMatch ? videoMatch[1].trim() : '전문간병사 교육 영상';
  const videoUrl = videoMatch ? videoMatch[2].trim() : '';

  const diseaseMatch = content.match(/-\s*\*\*주요 대상 질환\*\*:\s*([^\n\r]+)/);
  const targetDisease = diseaseMatch ? diseaseMatch[1].trim() : '';

  // 제1부, 제2부, 제3부, 제4부 분할
  const part2Index = content.indexOf('## 제2부.');
  const part3Index = content.indexOf('## 제3부.');
  const part4Index = content.indexOf('## 제4부.');

  const part1Text = content.substring(0, part2Index);
  const part2Text = content.substring(part2Index, part3Index);
  const part3Text = content.substring(part3Index, part4Index);
  const part4Text = content.substring(part4Index);

  // 스크립트 전문 추출
  const scriptMatch = part1Text.match(/>\s*\*\*\[영상 공식 스크립트 전문\]\*\*([\s\S]*?)(?=###|$)/);
  const scriptText = scriptMatch ? scriptMatch[1].replace(/>/g, '').trim() : '';

  // 제3부 실전 모의고사 30문항 파싱
  const mockQuestions = parseQuestions(part3Text, trackInfo.trackCode, 'MOCK', trackInfo.categoryId);

  // 제4부 최종 평가 30문항 파싱
  const finalQuestions = parseQuestions(part4Text, trackInfo.trackCode, 'FINAL', trackInfo.categoryId);

  // 제2부 정규 교안 5개 챕터 분할
  const chapters = [];
  const chapterBlocks = part2Text.split(/(?=###\s*제\d+장\.)/g).filter(b => b.trim().startsWith('###'));
  for (const cb of chapterBlocks) {
    const chMatch = cb.match(/###\s*(제\d+장\.\s*[^\n\r]+)/);
    if (chMatch) {
      chapters.push({
        title: chMatch[1].trim(),
        content: cb.trim(),
      });
    }
  }

  // HeyGen embedUrl 변환
  const embedUrl = videoUrl.replace('/videos/', '/embeds/');

  return {
    ...trackInfo,
    title,
    videoTitle,
    videoUrl,
    embedUrl,
    targetDisease,
    scriptText,
    chapters,
    mockQuestions,
    finalQuestions,
  };
}

const parsedTracks = trackFiles.map(parseTrackFile);

console.log('=== TRACK PARSING SUMMARY ===');
for (const t of parsedTracks) {
  console.log(`[${t.trackCode}] ${t.title}`);
  console.log(`  - Video: ${t.videoTitle} (${t.videoUrl})`);
  console.log(`  - Chapters: ${t.chapters.length} chapters`);
  console.log(`  - Mock Questions: ${t.mockQuestions.length} items`);
  console.log(`  - Final Questions: ${t.finalQuestions.length} items`);
}

const outputPath = path.join(__dirname, '../packages/utils/src/parsed_tracks.json');
fs.writeFileSync(outputPath, JSON.stringify(parsedTracks, null, 2), 'utf8');
console.log(`\nSuccessfully saved parsed data to ${outputPath}`);
