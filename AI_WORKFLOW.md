# AI Workflow

## Tool Used
I used **Cursor IDE** with **Claude Sonnet 4.5** integration for the entire project development.

## Example Prompts

1. **"can you recheck our overall process? see if we are able to meet all of this? [requirements pasted]"**
   - This worked excellently - AI analyzed all requirements and created a comprehensive checklist
   - Identified 2 missing features (filter and sort) that I hadn't implemented yet

2. **"make the cards draggable please so i can drag and drop from to do - to - in progress"**
   - Worked perfectly - generated complete drag-and-drop with HTML5 API
   - AI added visual feedback (colored rings, opacity changes) that I didn't request
   - Code worked immediately with no bugs

3. **"now its working, please update the board tasks content it is overlapping, and also please fix where if we add a card to which progress should be classified already"**
   - Had to describe the UI problem visually
   - AI fixed CSS overflow issues and added defaultStatus state for column tracking
   - Needed one iteration but then worked perfectly

## My Process

**Used AI for:**
- Generated complete Prisma schema with Project and Task models
- Created all API routes (GET, POST, PATCH, DELETE) with validation and error handling
- Built all React components (Dashboard, Board Detail, TaskCard, Modals)
- Implemented drag-and-drop functionality
- Created filter and sort logic
- Added analytics dashboard and export features
- Wrote all Tailwind CSS styling

**Manually coded:**
- Testing in browser (AI can't open browser)
- Database setup and credentials
- Design decisions (which features to prioritize)
- Final verification of all functionality

**Where AI code needed fixes:**
- Initial schema mismatch: AI used `Project` model in code but `Board` in schema - had to regenerate schema
- Board card layout broke after adding delete button - AI fixed by restructuring Link wrapper
- CANCELLED status removed from UI but stayed in schema - AI updated and regenerated Prisma Client

## Time Management

**First 30 min:** Database setup, Prisma schema, initial migrations  
**Next 60 min:** Built all API routes (projects and tasks CRUD endpoints)  
**Next 90 min:** Dashboard page with board cards and create modal  
**Next 120 min:** Board detail page with Kanban layout, task cards, and modals  
**Next 45 min:** Added drag-and-drop between columns  
**Next 30 min:** Implemented filter by status and sort by date/priority  
**Next 45 min:** Added analytics dashboard and export features  
**Last 30 min:** Documentation (README.md and this file)

**Total time:** ~5.5 hours

**Skipped:** 
- User authentication (not required)
- Real-time WebSocket updates (complex bonus feature)
- Automated tests (would add 3-4 hours)
- Mobile-specific optimizations

**If I had more time:**
- Add comprehensive test suite (Jest + React Testing Library)
- Implement user authentication with NextAuth
- Add task comments and activity log
- Create mobile app version
