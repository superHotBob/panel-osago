import React from 'react';


export const ScoreGraphSvg = ({className}) => {
    const filterId = 'filter-id_' + Math.random();
    return (
        <svg width="576" height="576" viewBox="0 0 576 576" fill="none" xmlns="http://www.w3.org/2000/svg"
             className={className}>
            <circle cx="288" cy="288" r="287.5" fill="white" stroke="#BCBBC0"/>
            <path
                d="M487.631 338.83C495.388 308.361 496.069 276.52 489.62 245.748C483.172 214.975 469.764 186.087 450.426 161.297C431.088 136.506 406.332 116.471 378.054 102.727C349.777 88.982 318.728 81.8925 287.288 82.0012C255.847 82.11 224.848 89.4141 196.666 103.354C168.484 117.294 143.867 137.5 124.701 162.423C105.535 187.347 92.328 216.327 86.0922 247.144C79.8565 277.96 80.7573 309.795 88.7258 340.209L288 288L487.631 338.83Z"
                fill="#F2F2F2"/>
            <circle cx="288" cy="288" r="140.5" stroke="#BCBBC0"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M103.878 182.385L53.8759 153.516C39.461 178.611 29.1346 205.931 23.3636 234.45C15.1905 274.84 16.3713 316.566 26.8154 356.429L82.6519 341.8C78.1628 324.619 75.773 306.588 75.773 288C75.773 249.55 85.9982 213.487 103.878 182.385Z"
                  fill="#5BB94A"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M382.635 35.1283L362.166 89.0927C442.801 119.171 500.227 196.88 500.227 288C500.227 306.077 497.967 323.625 493.714 340.379L549.652 354.621C559.82 314.687 560.712 272.954 552.26 232.621C543.807 192.288 526.235 154.425 500.889 121.933C475.543 89.4405 443.095 63.181 406.032 45.1662C398.379 41.4462 390.571 38.0982 382.635 35.1283Z"
                  fill="#EF5740"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M357.741 87.4978C335.898 79.9011 312.431 75.773 288.001 75.773C210.749 75.773 143.138 117.048 106.017 178.748L56.5986 148.884C61.8855 140.09 67.6823 131.583 73.968 123.409C99.0889 90.7423 131.354 64.259 168.291 45.9883C205.229 27.7175 245.858 18.1441 287.067 18.0016C317.763 17.8954 348.175 23.0244 377.012 33.0942L357.741 87.4978Z"
                  fill="#EC7D18"/>
            <path
                d="M80.74 418.142C80.74 416.518 81.0247 415.267 81.594 414.39C82.1727 413.513 82.9707 413.074 83.988 413.074C85.0054 413.074 85.7987 413.513 86.368 414.39C86.9467 415.267 87.236 416.518 87.236 418.142C87.236 419.766 86.9467 421.017 86.368 421.894C85.7987 422.771 85.0054 423.21 83.988 423.21C82.9707 423.21 82.1727 422.771 81.594 421.894C81.0247 421.017 80.74 419.766 80.74 418.142ZM85.864 418.142C85.864 417.61 85.8314 417.106 85.766 416.63C85.71 416.154 85.6074 415.739 85.458 415.384C85.318 415.029 85.1267 414.749 84.884 414.544C84.6414 414.329 84.3427 414.222 83.988 414.222C83.6334 414.222 83.3347 414.329 83.092 414.544C82.8494 414.749 82.6534 415.029 82.504 415.384C82.364 415.739 82.2614 416.154 82.196 416.63C82.14 417.106 82.112 417.61 82.112 418.142C82.112 418.674 82.14 419.178 82.196 419.654C82.2614 420.13 82.364 420.545 82.504 420.9C82.6534 421.255 82.8494 421.539 83.092 421.754C83.3347 421.959 83.6334 422.062 83.988 422.062C84.3427 422.062 84.6414 421.959 84.884 421.754C85.1267 421.539 85.318 421.255 85.458 420.9C85.6074 420.545 85.71 420.13 85.766 419.654C85.8314 419.178 85.864 418.674 85.864 418.142ZM88.6424 415.664C88.6424 415.244 88.6984 414.875 88.8104 414.558C88.9224 414.241 89.0764 413.975 89.2724 413.76C89.4777 413.536 89.7157 413.368 89.9864 413.256C90.257 413.144 90.551 413.088 90.8684 413.088C91.1857 413.088 91.4797 413.144 91.7504 413.256C92.021 413.368 92.2544 413.536 92.4504 413.76C92.6557 413.975 92.8144 414.241 92.9264 414.558C93.0384 414.875 93.0944 415.244 93.0944 415.664C93.0944 416.084 93.0384 416.453 92.9264 416.77C92.8144 417.087 92.6557 417.358 92.4504 417.582C92.2544 417.797 92.021 417.96 91.7504 418.072C91.4797 418.184 91.1857 418.24 90.8684 418.24C90.551 418.24 90.257 418.184 89.9864 418.072C89.7157 417.96 89.4777 417.797 89.2724 417.582C89.0764 417.358 88.9224 417.087 88.8104 416.77C88.6984 416.453 88.6424 416.084 88.6424 415.664ZM92.0024 415.664C92.0024 415.16 91.9044 414.768 91.7084 414.488C91.5124 414.199 91.2324 414.054 90.8684 414.054C90.5044 414.054 90.2244 414.199 90.0284 414.488C89.8324 414.768 89.7344 415.16 89.7344 415.664C89.7344 416.168 89.8324 416.565 90.0284 416.854C90.2244 417.134 90.5044 417.274 90.8684 417.274C91.2324 417.274 91.5124 417.134 91.7084 416.854C91.9044 416.565 92.0024 416.168 92.0024 415.664ZM94.8024 420.634C94.8024 420.214 94.8584 419.845 94.9704 419.528C95.0824 419.211 95.2364 418.945 95.4324 418.73C95.6377 418.506 95.8757 418.338 96.1464 418.226C96.417 418.114 96.711 418.058 97.0284 418.058C97.3457 418.058 97.6397 418.114 97.9104 418.226C98.1811 418.338 98.4144 418.506 98.6104 418.73C98.8157 418.945 98.9744 419.211 99.0864 419.528C99.1984 419.845 99.2544 420.214 99.2544 420.634C99.2544 421.054 99.1984 421.423 99.0864 421.74C98.9744 422.057 98.8157 422.328 98.6104 422.552C98.4144 422.767 98.1811 422.93 97.9104 423.042C97.6397 423.154 97.3457 423.21 97.0284 423.21C96.711 423.21 96.417 423.154 96.1464 423.042C95.8757 422.93 95.6377 422.767 95.4324 422.552C95.2364 422.328 95.0824 422.057 94.9704 421.74C94.8584 421.423 94.8024 421.054 94.8024 420.634ZM98.1624 420.634C98.1624 420.13 98.0644 419.738 97.8684 419.458C97.6724 419.169 97.3924 419.024 97.0284 419.024C96.6644 419.024 96.3844 419.169 96.1884 419.458C95.9924 419.738 95.8944 420.13 95.8944 420.634C95.8944 421.138 95.9924 421.535 96.1884 421.824C96.3844 422.104 96.6644 422.244 97.0284 422.244C97.3924 422.244 97.6724 422.104 97.8684 421.824C98.0644 421.535 98.1624 421.138 98.1624 420.634ZM97.3224 413.298L91.8484 423H90.5744L96.0484 413.298H97.3224Z"
                fill="#8F8E99"/>
            <path
                d="M469.577 415.3C470.109 415.095 470.627 414.833 471.131 414.516C471.635 414.189 472.097 413.783 472.517 413.298H473.441V423H472.139V415.104C472.027 415.207 471.887 415.314 471.719 415.426C471.561 415.538 471.383 415.645 471.187 415.748C471.001 415.851 470.8 415.949 470.585 416.042C470.38 416.135 470.179 416.215 469.983 416.28L469.577 415.3ZM476.878 418.142C476.878 416.518 477.162 415.267 477.732 414.39C478.31 413.513 479.108 413.074 480.126 413.074C481.143 413.074 481.936 413.513 482.506 414.39C483.084 415.267 483.374 416.518 483.374 418.142C483.374 419.766 483.084 421.017 482.506 421.894C481.936 422.771 481.143 423.21 480.126 423.21C479.108 423.21 478.31 422.771 477.732 421.894C477.162 421.017 476.878 419.766 476.878 418.142ZM482.002 418.142C482.002 417.61 481.969 417.106 481.904 416.63C481.848 416.154 481.745 415.739 481.596 415.384C481.456 415.029 481.264 414.749 481.022 414.544C480.779 414.329 480.48 414.222 480.126 414.222C479.771 414.222 479.472 414.329 479.23 414.544C478.987 414.749 478.791 415.029 478.642 415.384C478.502 415.739 478.399 416.154 478.334 416.63C478.278 417.106 478.25 417.61 478.25 418.142C478.25 418.674 478.278 419.178 478.334 419.654C478.399 420.13 478.502 420.545 478.642 420.9C478.791 421.255 478.987 421.539 479.23 421.754C479.472 421.959 479.771 422.062 480.126 422.062C480.48 422.062 480.779 421.959 481.022 421.754C481.264 421.539 481.456 421.255 481.596 420.9C481.745 420.545 481.848 420.13 481.904 419.654C481.969 419.178 482.002 418.674 482.002 418.142ZM484.78 418.142C484.78 416.518 485.065 415.267 485.634 414.39C486.213 413.513 487.011 413.074 488.028 413.074C489.045 413.074 489.839 413.513 490.408 414.39C490.987 415.267 491.276 416.518 491.276 418.142C491.276 419.766 490.987 421.017 490.408 421.894C489.839 422.771 489.045 423.21 488.028 423.21C487.011 423.21 486.213 422.771 485.634 421.894C485.065 421.017 484.78 419.766 484.78 418.142ZM489.904 418.142C489.904 417.61 489.871 417.106 489.806 416.63C489.75 416.154 489.647 415.739 489.498 415.384C489.358 415.029 489.167 414.749 488.924 414.544C488.681 414.329 488.383 414.222 488.028 414.222C487.673 414.222 487.375 414.329 487.132 414.544C486.889 414.749 486.693 415.029 486.544 415.384C486.404 415.739 486.301 416.154 486.236 416.63C486.18 417.106 486.152 417.61 486.152 418.142C486.152 418.674 486.18 419.178 486.236 419.654C486.301 420.13 486.404 420.545 486.544 420.9C486.693 421.255 486.889 421.539 487.132 421.754C487.375 421.959 487.673 422.062 488.028 422.062C488.383 422.062 488.681 421.959 488.924 421.754C489.167 421.539 489.358 421.255 489.498 420.9C489.647 420.545 489.75 420.13 489.806 419.654C489.871 419.178 489.904 418.674 489.904 418.142ZM492.682 415.664C492.682 415.244 492.738 414.875 492.85 414.558C492.962 414.241 493.116 413.975 493.312 413.76C493.518 413.536 493.756 413.368 494.026 413.256C494.297 413.144 494.591 413.088 494.908 413.088C495.226 413.088 495.52 413.144 495.79 413.256C496.061 413.368 496.294 413.536 496.49 413.76C496.696 413.975 496.854 414.241 496.966 414.558C497.078 414.875 497.134 415.244 497.134 415.664C497.134 416.084 497.078 416.453 496.966 416.77C496.854 417.087 496.696 417.358 496.49 417.582C496.294 417.797 496.061 417.96 495.79 418.072C495.52 418.184 495.226 418.24 494.908 418.24C494.591 418.24 494.297 418.184 494.026 418.072C493.756 417.96 493.518 417.797 493.312 417.582C493.116 417.358 492.962 417.087 492.85 416.77C492.738 416.453 492.682 416.084 492.682 415.664ZM496.042 415.664C496.042 415.16 495.944 414.768 495.748 414.488C495.552 414.199 495.272 414.054 494.908 414.054C494.544 414.054 494.264 414.199 494.068 414.488C493.872 414.768 493.774 415.16 493.774 415.664C493.774 416.168 493.872 416.565 494.068 416.854C494.264 417.134 494.544 417.274 494.908 417.274C495.272 417.274 495.552 417.134 495.748 416.854C495.944 416.565 496.042 416.168 496.042 415.664ZM498.842 420.634C498.842 420.214 498.898 419.845 499.01 419.528C499.122 419.211 499.276 418.945 499.472 418.73C499.678 418.506 499.916 418.338 500.186 418.226C500.457 418.114 500.751 418.058 501.068 418.058C501.386 418.058 501.68 418.114 501.95 418.226C502.221 418.338 502.454 418.506 502.65 418.73C502.856 418.945 503.014 419.211 503.126 419.528C503.238 419.845 503.294 420.214 503.294 420.634C503.294 421.054 503.238 421.423 503.126 421.74C503.014 422.057 502.856 422.328 502.65 422.552C502.454 422.767 502.221 422.93 501.95 423.042C501.68 423.154 501.386 423.21 501.068 423.21C500.751 423.21 500.457 423.154 500.186 423.042C499.916 422.93 499.678 422.767 499.472 422.552C499.276 422.328 499.122 422.057 499.01 421.74C498.898 421.423 498.842 421.054 498.842 420.634ZM502.202 420.634C502.202 420.13 502.104 419.738 501.908 419.458C501.712 419.169 501.432 419.024 501.068 419.024C500.704 419.024 500.424 419.169 500.228 419.458C500.032 419.738 499.934 420.13 499.934 420.634C499.934 421.138 500.032 421.535 500.228 421.824C500.424 422.104 500.704 422.244 501.068 422.244C501.432 422.244 501.712 422.104 501.908 421.824C502.104 421.535 502.202 421.138 502.202 420.634ZM501.362 413.298L495.888 423H494.614L500.088 413.298H501.362Z"
                fill="#8F8E99"/>
            <path
                d="M128.853 101.006L129.979 100.061L136.04 102.924L136.093 102.879L133.892 96.7746L135.018 95.8292L135.468 96.3653L137.755 103.769C138.198 105.225 137.933 106.361 136.961 107.177L136.264 107.763L135.544 106.905L136.241 106.32C136.598 106.02 136.692 105.514 136.522 104.804L136.449 104.5L129.303 101.542L128.853 101.006Z"
                fill="white"/>
            <path
                d="M146.357 87.1886L146.73 87.6958L146.683 88.3394L143.245 90.8724L148.394 97.8603L147.154 98.7738L141.341 90.8843L146.357 87.1886Z"
                fill="white"/>
            <path
                d="M159.449 90.1133L158.151 90.9432L152.87 82.688L156.762 80.1983C157.406 79.7858 158.002 79.6262 158.549 79.7193C159.097 79.8125 159.546 80.1343 159.898 80.6846L161.181 82.6894C161.533 83.2398 161.637 83.7829 161.492 84.3186C161.347 84.8544 160.952 85.3286 160.308 85.741L157.713 87.4009L159.449 90.1133ZM154.771 82.8016L157.11 86.4574L159.586 84.873C159.822 84.7221 159.968 84.5177 160.025 84.2599C160.082 84.0021 160.035 83.7552 159.884 83.5194L158.601 81.5145C158.45 81.2787 158.246 81.1324 157.988 81.0758C157.73 81.0191 157.483 81.0663 157.247 81.2172L154.771 82.8016Z"
                fill="white"/>
            <path
                d="M168.901 75.2209L171.713 80.3851C171.847 80.6311 172.04 80.7914 172.293 80.8661C172.547 80.9407 172.796 80.9111 173.042 80.7773L175.009 79.7062C175.255 79.5723 175.416 79.3788 175.49 79.1256C175.565 78.8724 175.535 78.6228 175.402 78.3769L172.59 73.2126C172.456 72.9667 172.263 72.8064 172.009 72.7317C171.756 72.657 171.507 72.6866 171.261 72.8205L169.293 73.8916C169.047 74.0255 168.887 74.219 168.812 74.4722C168.738 74.7254 168.767 74.975 168.901 75.2209ZM170.36 81.1215L167.549 75.9573C167.236 75.3835 167.171 74.8344 167.353 74.3102C167.536 73.7859 167.963 73.3408 168.635 72.9749L170.848 71.7699C171.52 71.404 172.126 71.2867 172.665 71.4183C173.204 71.5498 173.63 71.9025 173.943 72.4763L176.754 77.6405C177.067 78.2143 177.132 78.7634 176.949 79.2876C176.767 79.8119 176.34 80.257 175.668 80.6229L173.455 81.8279C172.783 82.1938 172.177 82.311 171.638 82.1795C171.098 82.048 170.673 81.6953 170.36 81.1215Z"
                fill="white"/>
            <path
                d="M186.641 70.0756L184.287 71.1561L183.82 70.1382L186.047 69.1161C186.301 68.9993 186.474 68.8171 186.566 68.5696C186.658 68.3221 186.645 68.0711 186.529 67.8166L186.032 66.7351C185.915 66.4807 185.733 66.3075 185.486 66.2157C185.238 66.124 184.987 66.1365 184.733 66.2533L181.361 67.801L180.775 67.5308L180.512 66.9583L184.393 65.177C185.088 64.8577 185.7 64.7821 186.229 64.9501C186.758 65.118 187.159 65.4989 187.432 66.0927L187.928 67.1742C188.146 67.6492 188.101 68.1113 187.794 68.5605C187.658 68.7564 187.483 68.9343 187.269 69.0942L187.298 69.1578C187.543 69.0866 187.813 69.0601 188.109 69.0784C188.704 69.1441 189.114 69.423 189.34 69.915L189.895 71.1238C190.168 71.7175 190.195 72.2697 189.978 72.7803C189.76 73.2909 189.304 73.7059 188.608 74.0251L184.473 75.9232L184.006 74.9053L188.014 73.0657C188.268 72.9489 188.441 72.7667 188.533 72.5192C188.625 72.2717 188.612 72.0207 188.495 71.7662L187.941 70.5574C187.824 70.303 187.642 70.1298 187.394 70.0381C187.147 69.9463 186.896 69.9588 186.641 70.0756Z"
                fill="white"/>
            <path
                d="M204.181 67.5982L202.618 65.6453L199.018 67.009L199.141 69.5075L197.766 70.0282L197.518 69.3736L197.24 59.7478L199.139 59.0287L205.308 66.4229L205.556 67.0775L204.181 67.5982ZM198.653 60.7099L198.948 65.8377L201.894 64.7219L198.718 60.6851L198.653 60.7099Z"
                fill="white"/>
            <path
                d="M229.838 59.8826L223.449 61.46L223.58 63.4467L222.424 63.732L221.686 60.7418L222.433 60.5572C222.579 60.406 222.692 60.2626 222.774 60.127C222.983 59.8062 223.069 59.4918 223.032 59.1838L221.916 51.7444L227.692 50.318L229.773 58.7449L231.064 58.4261L231.803 61.4162L230.647 61.7015L229.838 59.8826ZM223.543 52.4961L224.527 58.8146C224.555 59.0863 224.454 59.395 224.222 59.7407C224.113 59.883 223.987 60.0151 223.844 60.1369L223.861 60.2048L228.278 59.1141L226.466 51.7745L223.543 52.4961Z"
                fill="white"/>
            <path
                d="M236.852 49.4819L236.658 48.3787L243.966 47.0953L244.075 47.7158L243.746 48.271L241.264 48.7069L242.765 57.2561L241.249 57.5225L239.747 48.9733L236.852 49.4819Z"
                fill="white"/>
            <path
                d="M254.253 55.564L252.722 55.7299L251.665 45.987L258.764 45.2176L259.82 54.9605L258.289 55.1265L257.354 46.497L253.317 46.9345L254.253 55.564Z"
                fill="white"/>
            <path
                d="M492.848 167.872L489.535 162.187L487.666 162.871L487.066 161.843L489.727 160.292L490.115 160.958C490.301 161.055 490.471 161.123 490.624 161.163C490.991 161.274 491.317 161.268 491.601 161.145L498.425 157.978L501.421 163.119L493.922 167.489L494.591 168.639L491.93 170.189L491.331 169.161L492.848 167.872ZM498.162 159.752L492.377 162.475C492.124 162.579 491.799 162.569 491.402 162.444C491.235 162.379 491.073 162.295 490.916 162.192L490.855 162.228L493.146 166.159L499.678 162.352L498.162 159.752Z"
                fill="white"/>
            <path
                d="M504.815 171.992L505.836 171.532L508.889 178.294L508.315 178.554L507.696 178.372L506.659 176.076L498.748 179.647L498.114 178.244L506.025 174.672L504.815 171.992Z"
                fill="white"/>
            <path
                d="M503.069 190.399L502.579 188.939L511.868 185.818L514.142 192.586L504.852 195.707L504.362 194.247L512.59 191.483L511.297 187.635L503.069 190.399Z"
                fill="white"/>
            <path
                d="M52.4388 291.803L52.473 293.342L42.6754 293.56L42.6412 292.02L46.9801 291.924L46.8899 287.865L42.551 287.961L42.5168 286.422L52.3144 286.204L52.3486 287.744L48.0097 287.84L48.0998 291.899L52.4388 291.803Z"
                fill="white"/>
            <path
                d="M44.644 275.973L50.5167 276.266C50.7963 276.28 51.034 276.199 51.2298 276.022C51.4255 275.845 51.5304 275.616 51.5443 275.337L51.6561 273.099C51.67 272.82 51.5885 272.582 51.4113 272.386C51.2342 272.19 51.0058 272.086 50.7262 272.072L44.8535 271.778C44.5738 271.764 44.3361 271.846 44.1404 272.023C43.9447 272.2 43.8398 272.429 43.8258 272.708L43.7141 274.945C43.7001 275.225 43.7817 275.463 43.9588 275.659C44.1359 275.854 44.3643 275.959 44.644 275.973ZM50.4398 277.805L44.5672 277.511C43.9146 277.479 43.4122 277.248 43.0598 276.819C42.7074 276.39 42.5503 275.794 42.5885 275.029L42.7142 272.513C42.7524 271.748 42.9682 271.17 43.3615 270.779C43.7549 270.387 44.2778 270.208 44.9303 270.24L50.803 270.534C51.4555 270.566 51.958 270.797 52.3103 271.226C52.6627 271.654 52.8198 272.251 52.7817 273.015L52.6559 275.532C52.6178 276.297 52.402 276.875 52.0086 277.266C51.6153 277.658 51.0924 277.837 50.4398 277.805Z"
                fill="white"/>
            <path
                d="M53.6454 260.691L53.458 262.219L43.7308 261.026L44.2932 256.441C44.3863 255.681 44.6432 255.12 45.0637 254.758C45.4843 254.396 46.0188 254.255 46.6672 254.334L49.0295 254.624C49.678 254.703 50.1625 254.97 50.4831 255.423C50.8037 255.876 50.9174 256.482 50.8242 257.242L50.4494 260.299L53.6454 260.691ZM45.0299 259.634L49.3377 260.163L49.6955 257.244C49.7296 256.966 49.6654 256.723 49.5028 256.515C49.3403 256.308 49.12 256.186 48.8421 256.152L46.4798 255.863C46.2019 255.829 45.9589 255.893 45.7509 256.055C45.5429 256.218 45.4219 256.438 45.3878 256.716L45.0299 259.634Z"
                fill="white"/>
            <path
                d="M55.7464 240.104L55.3357 242.092L47.9162 243.061L47.902 243.129L55.807 245.692L55.5096 247.131L54.824 246.99L46.1672 243.914L46.5922 241.858L54.1629 240.849L54.1771 240.78L47.6261 236.854L48.0511 234.797L57.2178 235.404L57.9033 235.546L57.6059 236.986L49.3326 236.206L49.3184 236.274L55.7464 240.104Z"
                fill="white"/>
            <path
                d="M61.66 221.767L59.1595 221.835L58.0752 225.529L60.142 226.938L59.7281 228.349L59.0564 228.152L51.2118 222.567L51.7835 220.619L61.4023 220.159L62.074 220.356L61.66 221.767ZM52.8311 222.021L57.0991 224.878L57.9862 221.856L52.8508 221.953L52.8311 222.021Z"
                fill="white"/>
            <g filter={`url(#${filterId})`}>
                <ellipse cx="288" cy="288" rx="124" ry="124" fill="white"/>
            </g>
            <defs>
                <filter id={filterId} x="158.545" y="164" width="258.909" height="258.909" filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="5.45455"/>
                    <feGaussianBlur stdDeviation="2.72727"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
            </defs>
        </svg>

    );
}