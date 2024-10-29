export default async function handler(req, res) {
    const response = await fetch('http://localhost:8080/v1/objects/LinkedInMetrics', {
        headers: { 'Content-Type': 'application/json' },
    });
    const metrics = await response.json();
    res.status(200).json(metrics);
}
