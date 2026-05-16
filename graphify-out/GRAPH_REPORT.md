# Graph Report - ./src (2026-05-16)

## Corpus Check

- Corpus is ~1,159 words - fits in a single context window. You may not need a graph.

## Summary

- 28 nodes �� 42 edges �� 5 communities
- Extraction: 100% EXTRACTED �� 0% INFERRED �� 0% AMBIGUOUS
- Token cost: 0 input �� 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_API & Context Layer|API & Context Layer]]
- [[_COMMUNITY_App Root & Layout|App Root & Layout]]
- [[_COMMUNITY_Note Editor & Hook|Note Editor & Hook]]
- [[_COMMUNITY_Note List & Item|Note List & Item]]

## God Nodes (most connected - your core abstractions)

1. `useNotes()` - 5 edges
2. `Note` - 4 edges
3. `NoteEditor()` - 3 edges
4. `NoteList()` - 3 edges
5. `Layout()` - 2 edges
6. `NoteItem()` - 2 edges
7. `NotesProvider()` - 2 edges
8. `LayoutProps` - 1 edges
9. `NoteEditorProps` - 1 edges
10. `NoteItemProps` - 1 edges

## Surprising Connections (you probably didn't know these)

- `NoteEditor()` --calls--> `useNotes()` [EXTRACTED]
  components/NoteEditor.tsx �� context/NotesContext.tsx
- `NoteList()` --calls--> `useNotes()` [EXTRACTED]
  components/NoteList.tsx �� context/NotesContext.tsx

## Communities (5 total, 0 thin omitted)

### Community 0 - "API & Context Layer"

Cohesion: 0.27
Nodes (3): NotesContext, NotesContextType, Note

### Community 1 - "App Root & Layout"

Cohesion: 0.33
Nodes (3): Layout(), LayoutProps, NotesProvider()

### Community 2 - "Note Editor & Hook"

Cohesion: 0.5
Nodes (4): NoteEditor(), NoteEditorProps, NoteList(), useNotes()

### Community 3 - "Note List & Item"

Cohesion: 0.5
Nodes (3): NoteItem(), NoteItemProps, NoteListProps

## Knowledge Gaps

- **6 isolated node(s):** `LayoutProps`, `NoteEditorProps`, `NoteItemProps`, `NoteListProps`, `NotesContextType` (+1 more)
  These have ��1 connection - possible missing edges or undocumented components.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `useNotes()` connect `Note Editor & Hook` to `API & Context Layer`, `Note List & Item`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `Note` connect `API & Context Layer` to `Note List & Item`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `NoteEditor()` connect `Note Editor & Hook` to `App Root & Layout`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `LayoutProps`, `NoteEditorProps`, `NoteItemProps` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
