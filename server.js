const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const studentData = {};

app.post('/log-violation', (req, res) => {
    const { studentId, type, details, timestamp } = req.body;
    
    if (!studentData[studentId]) {
        studentData[studentId] = { violations: [], startTime: Date.now() };
    }
    
    studentData[studentId].violations.push({ type, details, timestamp });
    console.log(`[${timestamp}] ${studentId} - ${type}: ${details}`);
    
    res.json({ success: true });
});

app.post('/submit-exam', (req, res) => {
    const { studentId, answers, violations } = req.body;
    
    if (!studentData[studentId]) {
        studentData[studentId] = { violations: [] };
    }
    
    const trustScore = calculateTrustScore(violations);
    studentData[studentId].trustScore = trustScore;
    studentData[studentId].answers = answers;
    studentData[studentId].submittedAt = new Date().toISOString();
    
    res.json({ 
        success: true, 
        trustScore, 
        violationCount: violations.length 
    });
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/api/students', (req, res) => {
    const summary = Object.keys(studentData).map(id => ({
        studentId: id,
        violationCount: studentData[id].violations.length,
        trustScore: studentData[id].trustScore || calculateTrustScore(studentData[id].violations),
        violations: studentData[id].violations,
        submittedAt: studentData[id].submittedAt
    }));
    res.json(summary);
});

app.post('/remove-student/:studentId', (req, res) => {
    const { studentId } = req.params;
    if (studentData[studentId]) {
        delete studentData[studentId];
        console.log(`Student ${studentId} session removed`);
        res.json({ success: true, message: `Student ${studentId} removed` });
    } else {
        res.json({ success: false, message: 'Student not found' });
    }
});

function calculateTrustScore(violations) {
    let score = 100;
    const penalties = {
        TAB_SWITCH: 10,
        WINDOW_BLUR: 8,
        WINDOW_RESIZE: 15,
        KEYBOARD_SHORTCUT: 12,
        RIGHT_CLICK: 5,
        IDLE_DETECTED: 7
    };
    
    violations.forEach(v => {
        score -= penalties[v.type] || 5;
    });
    
    return Math.max(0, score);
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Auditor Dashboard running on http://localhost:${PORT}`);
    console.log(`📊 View dashboard at http://localhost:${PORT}/dashboard`);
    console.log(`📝 Open sentinel.html to start exam monitoring`);
});
