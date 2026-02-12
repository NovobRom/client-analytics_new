
const COLUMN_DEFINITIONS = [
    { key: 'idxName', required: true, aliases: ['Client Name', 'Name', 'Sender'], labelKey: 'colClientName' },
    { key: 'idxRev', required: true, aliases: ['Revenue', 'Amount', 'Cost'], labelKey: 'colRevenue' },
    { key: 'idxCountry', required: true, aliases: ['Origin Country', 'Country'], labelKey: 'colOriginCountry' },
    { key: 'idxDestCountry', required: true, aliases: ['Destination Country', 'Dest Country'], labelKey: 'colDestCountry' },
    { key: 'idxWeight', required: false, aliases: ['Weight', 'Calculated Weight'], labelKey: 'colWeight' },
    { key: 'idxDate', required: false, aliases: ['Date', 'Created Date'], labelKey: 'colDate' }
];

function fuzzyMatch(header, aliases) {
    const h = header.toLowerCase().trim();
    for (const alias of aliases) {
        if (h === alias.toLowerCase()) return 100;
    }
    for (const alias of aliases) {
        if (h.includes(alias.toLowerCase()) || alias.toLowerCase().includes(h)) return 80;
    }
    return 0;
}

function autoMapColumns(headers) {
    const mapped = {};
    const unmapped = [];

    console.log(`\nMapping headers: ${JSON.stringify(headers)}`);

    COLUMN_DEFINITIONS.forEach(def => {
        let bestMatch = -1;
        let bestScore = 0;

        headers.forEach((header, idx) => {
            if (!header || typeof header !== 'string') return;
            const score = fuzzyMatch(header, def.aliases);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = idx;
            }
        });

        if (bestScore >= 80) {
            mapped[def.key] = bestMatch;
            console.log(`  [MATCH] ${def.key} -> "${headers[bestMatch]}" (Score: ${bestScore})`);
        } else if (def.required) {
            unmapped.push(def);
            console.log(`  [MISSING REQUIRED] ${def.key}`);
        } else {
            mapped[def.key] = -1;
            console.log(`  [MISSING OPTIONAL] ${def.key}`);
        }
    });

    return { mapped, unmapped };
}

// Scenario 1: User renames optional columns (Weight -> Masa)
// Expectation: Unmapped list is empty (because Weight is optional), so Wizard NOT shown.
autoMapColumns(['Client Name', 'Revenue', 'Origin Country', 'Destination Country', 'Masa']);

// Scenario 2: User renames Required column (Revenue -> Money)
// Expectation: Unmapped list includes idxRev. Wizard SHOWN.
autoMapColumns(['Client Name', 'Money', 'Origin Country', 'Destination Country', 'Weight']);

// Scenario 3: User renames "Client Name" to "Name of Customer"
// Expectation: Matches "Name" alias?
autoMapColumns(['Name of Customer', 'Revenue', 'Origin Country', 'Destination Country']);
