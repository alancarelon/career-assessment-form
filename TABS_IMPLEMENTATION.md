# Tabs Implementation Plan

## Changes Needed:

1. Add state: `const [activeTab, setActiveTab] = useState<'overview' | 'story'>('overview')`

2. Add tabs UI after the header

3. Wrap existing content in `{activeTab === 'overview' && (...)}`

4. Add new story tab content with narrative summary

## Story Tab Content:
- Introduction paragraph
- Journey highlights
- Growth trajectory
- Personalized narrative based on their data
- Next steps recommendation
