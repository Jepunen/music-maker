<h1 align="center">Music maker documentation<h1/> <br> Jere Puurunen

The project's base was the music maker source provided in week 3. I started by removing the radio track selectors since they’re not needed to select the tracks. After that, I started implementing the drag n drop feature, allowing the user to grab a sample button and drop it in any of the tracks. Drag and drop is implemented using the dataTransfer (https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) API.

The next thing I started implementing was the adjustable volume for each track. I ended up using the input type range element since it’s easy to understand what it does even without a label, and it’s pretty easy to implement. The slider is set to step between 5% volume levels.

The sample lengths are visualized in multiple ways on the tracks. When hovering over the sample blocks on the tracks, it displays the sample name and length in seconds. The width of the sample block also indicates how long the sample is. The maximum width is set to 100% and the minimum width is set to 2% to prevent someone from uploading a multi-minute sample and overflooding the track. Widths are calculated by taking the length of the track, dividing it by 60, and then multiplying it by 100 to get the percentage it is of 60 seconds. This way when the track is filled it represents 60 seconds regardless of the window size.

Users can add as many tracks as they wish and adjust the volume etc. for each track. This was implemented simply by making the loop of creating a track into a function that is called once at the launch of the website, and again after the user presses the “add a track” button.

I also wanted to implement interactive play, pause and reset buttons that are only shown to the user when they’re relevant. For example, the pause button is hidden as long as nothing is playing, and when something is playing, the user doesn’t need the start button so it’s hidden. The reset button is only shown when there is either music playing or paused, and it removes all of the sample blocks from the tracks and the state of play/pause buttons.

| Feature | Points |
| :------ | :----: |
| Well written report | 2 |
| Application is responsive and can be used on both desktop and mobile environment | 4 |
| Application works on Firefox, Safari, Edge, and Chrome | 2 |
| Drag’n’drop new instruments to the tracks (with the mouse or touch screen) | 4 |
| Adjustable volume per track | 2 |
| Instrument's length is visualized on the track | 4 |
| Users can add as many tracks as they see fit | 1 |
| Interactive play/play/reset | 1 |
| Sample length calculated in seconds and displayed on hover on the track | 2 |
| Track calculated to fill a 60s span and sample block sizes match it | 3 |
| Total | 25 |
