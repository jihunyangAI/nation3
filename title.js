// ===================== 타이틀 화면 =====================
// 글자 윤곽: Yuji Boku, Copyright 2021 The Yuji Project Authors (SIL Open Font License 1.1, https://openfontlicense.org)
// 벽화는 외부 그림 없이 캔버스에 직접 그린다.
(() => {
  const GLYPH = {"三":"M972 802L972 802Q962 806 958 818Q953 829 941 836L941 836Q929 843 914 841Q899 839 882 835L882 835Q866 830 850 825Q833 819 819 817L819 817Q810 815 799 815Q787 815 775 815L775 815Q767 816 759 816Q750 816 742 815L742 815Q733 814 725 813Q717 812 710 811L710 811Q693 809 676 808Q659 806 638 811L638 811Q636 812 639 809L639 809Q645 804 643 803L643 803Q599 803 544 805Q488 807 430 812Q371 816 316 825Q260 833 215 847L215 847Q209 849 204 851Q199 853 194 855L194 855Q178 861 162 865Q146 868 125 862L125 862Q101 854 92 834Q83 813 70 795L70 795Q62 783 51 775Q40 767 37 751L37 751Q50 745 63 748Q76 750 89 755L89 755Q96 757 104 759Q111 761 118 762L118 762Q156 765 196 761Q235 757 275 752L275 752Q297 749 320 746Q342 743 364 742L364 742Q460 736 559 736Q657 735 751 743L751 743Q759 740 765 735Q770 729 776 725L776 725Q835 724 885 747Q935 769 972 802ZM813 292L813 292Q739 295 655 296Q570 297 488 301Q406 304 336 316L336 316Q323 318 311 322Q299 326 287 328L287 328Q275 330 264 330Q252 329 239 321L239 321Q229 314 213 296Q196 277 186 267L186 267Q180 260 175 252Q169 244 164 230L164 230Q165 224 169 221Q172 218 176 216L176 216Q179 214 182 212Q184 209 182 204L182 204Q227 222 278 229Q328 235 383 235L383 235Q439 235 499 232Q559 228 622 225L622 225Q642 224 661 216Q680 208 699 207L699 207Q718 205 735 212Q751 219 767 228L767 228Q775 232 783 236Q791 240 799 243L799 243Q800 249 803 254Q805 258 807 261L807 261Q811 268 814 275Q816 281 813 292ZM762 542L762 542Q733 546 699 546Q664 546 626 546L626 546Q613 545 599 545Q584 545 570 545L570 545Q518 545 466 548Q414 551 368 565L368 565Q361 567 353 571Q345 574 338 577L338 577Q331 580 325 581Q318 582 313 579L313 579Q288 565 258 542Q228 518 212 491L212 491Q265 484 323 483Q381 481 439 480L439 480Q497 478 550 475Q603 471 645 461L645 461Q674 465 699 475Q723 485 745 497L745 497Q746 501 748 505Q750 508 753 512L753 512Q757 519 761 527Q764 535 762 542Z","國":"M899 212L899 212Q877 213 859 230Q840 247 829 266L829 266Q833 359 837 458Q840 557 842 654Q844 750 841 837L841 837Q841 841 842 845Q842 848 842 852L842 852Q843 859 843 867Q843 874 841 884L841 884Q840 886 843 887Q845 887 845 887L845 887Q840 890 838 905Q836 920 832 937Q827 953 816 964L816 964Q780 955 760 927Q739 899 727 874L727 874Q674 867 610 868Q545 868 476 873Q407 878 341 883L341 883Q311 886 283 888Q255 890 229 892L229 892Q228 893 228 898L228 898Q228 901 228 906Q227 910 223 912L223 912Q197 909 179 898Q160 887 147 874Q133 860 120 852L120 852Q113 836 121 829Q129 822 138 818L138 818Q143 816 147 814Q150 812 152 809L152 809Q156 802 155 796Q154 789 151 782L151 782Q148 775 146 767Q144 758 147 746L147 746Q148 747 150 749L150 749Q153 753 158 752L158 752Q154 700 155 650Q155 600 157 549L157 549Q157 532 158 515Q159 497 159 480L159 480Q160 438 159 395Q158 352 153 307L153 307Q149 293 140 289Q131 284 125 278L125 278Q120 272 116 263Q111 254 97 248L97 248Q110 237 115 226Q120 215 126 205L126 205Q187 182 262 172Q336 162 415 158L415 158Q489 154 564 153Q639 151 709 147L709 147Q713 140 725 138Q736 136 748 134Q760 131 763 126L763 126Q785 135 810 138Q834 141 858 148Q881 154 898 175L898 175Q903 185 903 192Q902 198 900 205L900 205Q899 210 899 212ZM748 754L748 754Q736 767 722 768Q708 769 694 763L694 763Q675 755 661 737Q646 719 640 702L640 702Q635 685 625 664Q614 643 608 626L608 626Q596 654 582 683Q567 711 545 732Q522 752 484 757L484 757Q483 761 470 768Q456 775 450 774L450 774Q464 760 479 748Q494 735 504 717L504 717Q471 723 437 736Q403 748 371 758L371 758Q334 769 300 770Q266 770 239 746L239 746Q244 742 244 738Q244 734 243 731L243 731Q242 728 242 725Q242 722 245 719L245 719Q277 718 304 714Q331 710 356 703L356 703Q391 694 424 683Q456 672 492 664L492 664Q501 668 510 673Q518 677 530 679L530 679Q547 650 559 623Q571 596 582 566L582 566Q571 546 564 518Q557 490 549 466L549 466Q532 477 528 498Q524 518 521 542Q517 565 500 584L500 584Q497 591 498 594Q499 597 501 599L501 599Q503 601 505 604Q506 606 507 610L507 610Q489 621 462 624Q435 627 406 629Q376 630 349 638L349 638Q348 643 349 647Q350 650 352 654L352 654Q353 657 354 660Q355 663 354 668L354 668Q327 670 309 658Q290 645 284 623L284 623Q281 612 282 599Q283 586 286 572L286 572Q288 553 290 533Q291 513 285 493L285 493Q271 488 266 476Q261 463 259 446L259 446Q279 436 305 435Q331 433 360 432L360 432Q379 431 399 429Q418 426 438 419L438 419Q440 416 436 412L436 412Q432 409 435 406L435 406Q468 405 493 417Q517 428 537 440L537 440Q540 442 542 443L542 443Q535 426 533 405Q530 383 525 364L525 364Q506 364 482 367Q458 370 433 373L433 373Q410 377 388 380Q366 382 349 382L349 382Q321 382 294 367Q266 352 256 327L256 327Q292 324 337 322Q381 320 427 316Q472 311 510 304L510 304Q508 272 494 253Q480 233 460 219L460 219Q462 215 464 213Q466 210 467 206L467 206Q399 207 341 219Q282 231 240 251L240 251Q247 267 247 280Q246 293 235 308L235 308Q237 358 237 420Q237 482 236 548L236 548L236 550Q235 620 233 692Q231 764 231 829L231 829Q370 816 502 813Q634 809 743 814L743 814Q746 799 748 786Q749 772 748 754ZM750 601L750 601Q748 564 748 527Q747 489 748 452L748 452Q748 388 746 328Q744 268 732 220L732 220L732 216Q718 205 687 202Q656 199 618 200Q580 201 543 204L543 204Q538 204 532 204Q525 204 518 204L518 204Q505 204 493 204Q480 204 474 207L474 207Q483 211 498 211Q513 210 524 214L524 214Q553 224 570 246Q587 268 578 300L578 300Q601 306 623 313Q645 320 651 344L651 344Q636 351 618 352Q600 352 590 359L590 359Q590 398 599 435Q608 471 615 507L615 507Q624 491 631 466Q638 441 643 417Q648 393 647 379L647 379Q672 374 686 390Q700 406 710 432L710 432Q695 469 679 505Q663 541 646 576L646 576Q648 584 653 599Q657 613 665 627Q672 641 681 647L681 647Q686 625 691 598Q696 570 703 549L703 549Q708 576 714 605Q719 633 725 659L725 659Q731 684 736 707Q740 729 746 747L746 747Q754 723 754 687Q753 650 751 614L751 614Q751 611 751 608Q750 604 750 601ZM446 469L446 469Q441 472 424 474Q406 476 387 479Q367 482 356 488L356 488Q354 495 354 514Q353 532 354 553Q354 574 351 591L351 591Q366 592 382 590Q397 587 411 584L411 584Q418 582 425 581Q432 580 438 579L438 579Q439 576 440 573Q440 570 441 567L441 567Q446 543 449 521Q452 498 446 469ZM712 329L712 329Q704 336 698 336Q691 335 681 343L681 343Q647 329 623 297Q599 264 589 233L589 233Q634 242 669 262Q704 282 712 329ZM163 696L163 696Q165 691 166 678Q167 664 168 649Q168 633 167 623Q166 612 163 613L163 613Q163 617 161 636Q159 655 159 674Q159 692 163 696Z","志":"M813 319L813 319Q741 328 667 332Q593 335 523 340L523 340Q518 375 517 406Q515 437 509 466L509 466Q542 470 575 468Q607 465 629 450L629 450Q656 455 682 461Q707 466 726 479Q744 491 748 519L748 519Q700 526 636 527Q572 527 507 531L507 531Q458 534 412 541Q366 547 328 563L328 563Q291 557 259 539Q226 520 212 477L212 477Q245 479 286 480Q327 481 369 479Q411 476 446 471L446 471Q453 453 453 436Q452 419 450 401L450 401Q449 387 448 373Q447 358 449 342L449 342Q419 347 388 348Q356 349 328 353Q299 356 276 370L276 370Q265 368 257 363Q248 358 235 358L235 358Q223 332 204 312Q184 291 173 261L173 261L174 261Q237 273 302 281Q366 289 441 277L441 277Q443 212 434 169Q425 126 402 84L402 84Q402 81 405 78L405 78Q410 75 408 70L408 70Q455 72 486 93Q517 113 544 142L544 142Q531 167 530 203Q529 239 524 271L524 271Q533 270 544 270Q555 270 568 270L568 270Q606 270 650 267Q693 264 717 250L717 250Q739 256 761 264Q782 271 798 284Q813 296 813 319ZM901 837L901 837Q897 852 884 860Q871 867 865 881L865 881Q811 903 761 907Q710 911 648 907L648 907Q609 904 566 898Q523 892 485 881Q447 869 423 850L423 850Q409 838 393 818Q377 797 363 775Q349 753 339 734L339 734Q323 702 311 666Q298 630 282 594L282 594Q316 593 334 617Q352 641 367 669L367 669Q369 673 371 677Q373 680 375 684L375 684Q389 708 404 735Q418 762 438 783Q457 804 485 812L485 812Q520 822 566 824Q612 826 658 820Q703 814 736 799L736 799Q720 757 691 729Q662 701 632 673L632 673Q643 674 657 675Q671 675 682 679L682 679Q690 681 699 690Q707 698 716 701L716 701Q721 703 726 703Q730 703 735 703L735 703Q741 703 747 704Q752 705 757 709L757 709Q760 712 761 718Q761 723 764 726L764 726Q766 728 770 724L770 724Q773 721 774 722L774 722Q775 723 773 728L773 728Q772 732 772 734Q772 736 777 732L777 732Q784 726 803 742L803 742Q817 753 833 770Q849 787 863 799L863 799Q875 809 886 814Q897 818 901 837ZM254 914L254 914Q241 919 217 908Q193 897 173 880L173 880Q154 863 142 843Q129 823 133 805Q137 786 167 775L167 775Q164 750 165 726Q166 702 167 678L167 678Q168 669 169 660Q170 650 170 640L170 640L176 639Q198 647 210 670Q222 692 228 723Q234 753 238 785Q241 816 245 842L245 842Q249 862 252 881Q254 899 254 914ZM840 678L840 678Q830 673 822 677Q813 680 806 685L806 685Q767 671 736 650Q704 628 675 604Q645 580 612 559L612 559Q633 551 665 551Q696 551 729 559Q761 566 783 580L783 580Q796 588 811 604Q826 620 836 640Q845 659 840 678ZM587 737L587 737Q580 736 580 744L580 744Q550 749 534 738Q518 726 506 712L506 712Q500 705 494 699Q487 692 479 687L479 687Q479 672 472 659Q465 645 456 632L456 632Q450 623 445 615Q439 606 436 596L436 596Q457 594 484 603Q510 612 535 631Q559 649 574 676Q589 703 587 737Z","天":"M929 873L929 873Q919 889 898 897Q876 904 850 904L850 904Q811 904 771 892Q730 880 710 863L710 863Q679 809 642 752Q605 695 568 642Q531 589 498 547L498 547Q473 599 447 653Q421 706 389 755Q356 803 312 842Q267 880 205 903L205 903Q194 900 184 902Q173 904 162 907L162 907Q151 910 139 912Q126 914 111 912L111 912Q103 904 100 903Q97 901 85 897L85 897Q85 897 97 892Q109 887 117 893L117 893Q138 874 170 856Q201 837 231 816Q261 795 275 770L275 770Q332 726 363 659Q394 592 416 517L416 517Q371 520 328 524Q285 527 249 538L249 538Q245 539 242 541Q239 542 235 544L235 544Q229 547 223 550Q216 552 207 549L207 549Q197 546 183 530Q169 514 161 505L161 505Q152 494 146 480Q139 466 127 457L127 457Q137 446 154 445Q170 444 187 449Q203 454 214 461L214 461Q261 450 319 448Q376 446 427 438L427 438Q434 411 433 379Q432 347 426 318Q419 288 409 268L409 268Q380 268 358 270Q335 272 312 275Q289 278 257 283L257 283Q238 253 215 229Q191 204 180 171L180 171Q204 167 226 172Q247 177 268 183L268 183Q286 189 306 194Q326 199 349 198L349 198Q390 197 442 192Q494 187 546 181Q598 174 638 167L638 167Q678 160 717 170Q755 179 781 211L781 211Q777 221 766 226Q755 230 746 232L746 232Q689 246 623 249Q557 251 489 259L489 259Q492 267 507 278Q522 288 526 304L526 304Q518 332 519 364Q519 395 513 429L513 429Q548 422 583 422Q618 422 649 418L649 418Q658 416 667 412Q675 408 684 407L684 407Q708 405 737 418Q765 430 778 440L778 440Q798 455 812 472L812 472Q774 484 728 488Q681 491 633 493Q584 495 538 503L538 503Q577 547 622 596Q667 644 722 685Q776 725 842 745L842 745Q850 758 864 766Q877 773 891 779L891 779Q893 797 907 809Q921 821 929 835L929 835Q934 843 935 852Q936 861 929 873Z","下":"M944 251L944 251Q931 247 915 246Q899 244 882 244L882 244Q859 243 838 240Q816 237 805 226L805 226Q801 228 799 232Q796 236 791 237L791 237Q760 230 724 230Q687 229 647 230L647 230Q624 231 601 232Q577 232 553 231L553 231Q557 242 556 251Q554 260 550 271L550 271Q546 282 543 296Q540 309 543 329L543 329Q579 339 615 356Q651 372 685 374L685 374Q719 402 744 440Q768 478 776 531L776 531Q746 547 718 535Q690 523 664 497Q638 470 614 442L614 442Q595 419 578 400Q560 381 543 372L543 372Q536 451 537 543Q538 634 541 724L541 724Q543 786 545 845Q546 904 544 955L544 955Q527 961 509 953Q491 945 477 930Q462 914 453 896Q443 878 442 865L442 865Q442 858 447 850Q451 841 453 833L453 833Q455 826 457 803Q458 780 460 749Q461 718 462 686Q462 653 461 628L461 628Q460 587 461 547Q461 507 463 470L463 470Q464 419 465 374Q465 328 459 291L459 291Q457 276 447 265Q436 253 428 242L428 242Q409 237 391 241Q373 244 356 249L356 249Q345 253 333 256Q321 258 309 259L309 259Q305 259 298 257L298 257Q294 257 290 257Q286 256 282 256L282 256Q264 259 247 266Q229 273 213 281L213 281Q192 291 173 298Q153 305 135 301L135 301Q114 296 99 280Q84 264 71 245Q57 226 38 214L38 214Q50 206 51 201Q52 195 62 179L62 179Q68 181 75 184Q81 186 87 189L87 189Q102 195 117 199Q131 202 146 190L146 190Q199 188 257 184Q314 180 372 176L372 176Q458 169 542 164Q625 159 693 161L693 161Q696 161 701 161L701 161Q708 161 715 161Q721 161 726 158L726 158Q740 162 752 159Q763 156 772 152L772 152Q777 150 782 149Q787 147 791 147L791 147Q817 145 847 153Q876 160 901 175Q926 189 939 209Q952 228 944 251Z"};
  // 획순 중심선: [선 굵기, x, y, x, y ...] (글자 좌표 0~1000)
  const STROKES = {
    '三': [
      [150, 170, 240, 400, 265, 640, 250, 800, 280],
      [150, 220, 500, 420, 510, 640, 490, 760, 525],
      [170, 30, 770, 200, 810, 500, 770, 780, 755, 970, 810],
    ],
    '國': [
      [120, 108, 235, 150, 400, 165, 700, 185, 890],
      [130, 120, 225, 350, 170, 720, 155, 800, 190, 805, 500, 805, 800, 790, 940],
      [90, 260, 335, 450, 330, 640, 300],
      [70, 290, 450, 300, 650],
      [80, 270, 440, 430, 420, 520, 470, 500, 620],
      [60, 320, 640, 500, 610],
      [80, 245, 745, 380, 730, 510, 680],
      [90, 480, 215, 560, 300, 600, 470, 650, 620, 720, 730, 770, 770],
      [80, 700, 420, 650, 560, 590, 690, 480, 770],
      [50, 700, 555, 735, 740],
      [80, 610, 240, 700, 320],
      [100, 190, 875, 480, 840, 790, 830],
    ],
    '志': [
      [130, 180, 270, 400, 310, 650, 280, 800, 310],
      [120, 420, 75, 480, 150, 470, 300, 475, 480],
      [120, 220, 490, 340, 540, 560, 500, 740, 520],
      [120, 180, 650, 170, 800, 230, 905],
      [140, 285, 600, 350, 720, 440, 835, 620, 880, 800, 860, 890, 830, 760, 760, 640, 675],
      [120, 440, 600, 530, 650, 580, 735],
      [120, 625, 560, 750, 590, 835, 670],
    ],
  };
  const TITLE_CHARS = ['三', '國', '志'];

  function strokePath(p) {
    const pts = []; for (let i = 1; i < p.length; i += 2) pts.push([p[i], p[i + 1]]);
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += `Q${pts[i][0]} ${pts[i][1]} ${mx} ${my}`;
    }
    const e = pts[pts.length - 1];
    return d + `L${e[0]} ${e[1]}`;
  }

  // ---------- 벽화 ----------
  const INK = '#24160e', RED = '#8e2f1d', TEAL = '#2c5a50', OCHRE = '#b4802f', LEAD = '#dccdaa', BLACK = '#1b120c';

  function rng(seed) {
    return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function line(c, pts, w, col) {
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
    c.stroke();
  }
  function curve(c, x0, y0, cx, cy, x1, y1, w, col) {
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cx, cy, x1, y1); c.stroke();
  }
  function shape(c, col, fn, edge, ew) {
    c.fillStyle = col; c.beginPath(); fn(c); c.closePath(); c.fill();
    if (edge) { c.strokeStyle = edge; c.lineWidth = ew || 2; c.lineJoin = 'round'; c.stroke(); }
  }

  function horseLeg(c, pts, col) {
    line(c, pts.slice(0, 4), 17, col); line(c, pts.slice(2, 6), 10, col);
    line(c, pts.slice(4, 6).concat(pts[4] + 7, pts[5] + 3), 13, BLACK);
  }
  function drawHorse(c, coat, cloth) {
    const far = coat === LEAD ? '#a8987a' : BLACK;
    horseLeg(c, [52, -72, 112, -66, 165, -38], far);
    horseLeg(c, [-82, -72, -128, -62, -182, -30], far);
    // 꼬리
    shape(c, BLACK, x => { x.moveTo(-104, -100); x.bezierCurveTo(-150, -128, -195, -112, -238, -128); x.bezierCurveTo(-205, -92, -160, -84, -112, -82); });
    // 몸통과 목
    shape(c, coat, x => {
      x.moveTo(-105, -100); x.bezierCurveTo(-70, -122, 20, -118, 55, -112);
      x.bezierCurveTo(72, -135, 88, -165, 108, -182); x.lineTo(114, -200); x.lineTo(123, -181);
      x.bezierCurveTo(140, -172, 158, -155, 167, -140); x.bezierCurveTo(171, -129, 160, -123, 148, -128);
      x.bezierCurveTo(132, -134, 118, -136, 108, -128); x.bezierCurveTo(98, -105, 88, -82, 70, -66);
      x.bezierCurveTo(40, -52, -30, -52, -70, -62); x.bezierCurveTo(-100, -68, -118, -82, -105, -100);
    }, INK, 2.5);
    horseLeg(c, [60, -70, 104, -46, 150, -18], coat === LEAD ? '#cdbd98' : coat);
    horseLeg(c, [-78, -70, -112, -40, -160, -12], coat === LEAD ? '#cdbd98' : coat);
    // 갈기
    for (let i = 0; i < 6; i++) { const t = i / 5, x = 62 + t * 44, y = -118 - t * 62; curve(c, x, y, x - 22, y - 6, x - 36, y + 8, 5, BLACK); }
    // 굴레, 눈, 가슴걸이
    line(c, [150, -128, 122, -160, 110, -178], 2.5, RED); line(c, [122, -160, 92, -140, 30, -150], 2, INK);
    c.fillStyle = coat === LEAD ? INK : LEAD; c.beginPath(); c.arc(136, -158, 3, 0, 7); c.fill();
    curve(c, 78, -92, 40, -66, 16, -74, 4, RED);
    for (let i = 0; i < 4; i++) line(c, [70 - i * 15, -80 + i * 3, 70 - i * 15, -66 + i * 3], 3, OCHRE);
    // 안장깔개
    shape(c, cloth, x => { x.moveTo(-62, -116); x.lineTo(28, -116); x.lineTo(36, -74); x.lineTo(-68, -72); }, INK, 2);
    line(c, [-62, -80, 32, -82], 4, OCHRE);
  }
  function drawWeapon(c, kind, col) {
    // 손 위치 기준, +x 쪽이 날
    line(c, [-120, 0, 300, 0], 6, INK);
    if (kind === 'guan') {
      shape(c, col, x => { x.moveTo(292, 8); x.bezierCurveTo(330, 18, 385, 2, 410, -46); x.bezierCurveTo(392, -30, 350, -24, 296, -12); });
      c.strokeStyle = INK; c.lineWidth = 2; c.stroke();
      line(c, [284, -14, 284, 14], 6, OCHRE);
    } else if (kind === 'ji') {
      shape(c, col, x => { x.moveTo(296, -7); x.lineTo(392, 0); x.lineTo(296, 7); }, INK, 2);
      shape(c, col, x => { x.moveTo(268, -4); x.bezierCurveTo(274, -30, 296, -44, 322, -48); x.bezierCurveTo(304, -32, 296, -18, 292, -4); }, INK, 2);
      line(c, [250, 3, 262, 28], 4, RED); line(c, [262, 3, 276, 26], 4, RED);
    } else {
      shape(c, col, x => { x.moveTo(296, -9); x.lineTo(366, 0); x.lineTo(296, 9); }, INK, 2);
      line(c, [276, 3, 268, 24], 4, RED); line(c, [286, 3, 282, 25], 4, RED);
    }
  }
  function drawRider(c, o) {
    // 망토
    shape(c, o.cape, x => {
      x.moveTo(-6, -212); x.bezierCurveTo(-60, -214, -96, -188, -150, -206); x.bezierCurveTo(-136, -184, -158, -172, -188, -170);
      x.bezierCurveTo(-150, -146, -92, -140, -22, -150);
    }, INK, 2);
    // 다리
    shape(c, o.armor, x => { x.moveTo(-26, -128); x.lineTo(16, -132); x.lineTo(32, -92); x.lineTo(14, -60); x.lineTo(0, -66); x.lineTo(8, -92); }, INK, 2);
    line(c, [10, -60, 30, -56], 7, BLACK);
    // 몸통
    shape(c, o.armor, x => { x.moveTo(-28, -126); x.bezierCurveTo(-34, -170, -20, -208, 4, -222); x.lineTo(34, -212); x.bezierCurveTo(42, -180, 28, -146, 20, -126); }, INK, 2.5);
    for (let i = 0; i < 4; i++) line(c, [-24 + i * 2, -194 + i * 18, 30 - i * 2, -192 + i * 18], 2, OCHRE);
    line(c, [-30, -126, 22, -126], 6, OCHRE);
    // 목, 얼굴, 투구
    shape(c, o.skin, x => { x.moveTo(6, -222); x.lineTo(8, -252); x.bezierCurveTo(14, -262, 36, -260, 38, -244); x.lineTo(43, -236); x.lineTo(36, -232); x.bezierCurveTo(32, -222, 24, -218, 24, -214); }, INK, 2);
    if (o.beard) shape(c, BLACK, x => { x.moveTo(26, -228); x.bezierCurveTo(34, -214, 30, -190, 42, -176); x.bezierCurveTo(22, -184, 12, -206, 16, -226); });
    shape(c, o.helm, x => { x.moveTo(2, -246); x.bezierCurveTo(2, -276, 38, -280, 42, -250); x.lineTo(24, -254); x.lineTo(14, -240); }, INK, 2);
    curve(c, 18, -274, -14, -318, -58, -304, 6, o.plume); curve(c, 22, -274, 2, -326, -36, -326, 4, o.plume);
    // 어깨, 무기
    c.save(); c.translate(44, -188); c.rotate(o.ang); drawWeapon(c, o.weapon, o.blade); c.restore();
    shape(c, o.helm, x => { x.arc(14, -206, 15, 0, 7); }, INK, 2);
    line(c, [14, -204, 30, -180, 44, -188], 11, o.armor);
    c.fillStyle = o.skin; c.beginPath(); c.arc(44, -188, 6, 0, 7); c.fill();
  }
  function cavalry(c, x, y, s, dir, o) {
    c.save(); c.translate(x, y); c.scale(s * dir, s); c.rotate(-0.035);
    drawHorse(c, o.coat, o.cloth); drawRider(c, o); c.restore();
  }
  function soldier(c, x, y, s, dir, col, r) {
    c.save(); c.translate(x, y); c.scale(s * dir, s);
    const st = 10 + r * 9;
    line(c, [-3, -48, -st - 6, -24, -st - 16, 0], 8, BLACK); line(c, [3, -48, st, -26, st + 8, 0], 8, BLACK);
    shape(c, col, x2 => { x2.moveTo(-14, -44); x2.lineTo(12, -44); x2.lineTo(15, -92); x2.lineTo(-6, -102); x2.lineTo(-16, -90); }, INK, 1.5);
    shape(c, LEAD, x2 => { x2.arc(3, -112, 10, 0, 7); }, INK, 1.5);
    shape(c, BLACK, x2 => { x2.moveTo(-8, -114); x2.bezierCurveTo(-6, -128, 12, -128, 14, -116); x2.lineTo(2, -119); });
    line(c, [-44, -58, 82, -112], 3.5, INK);
    shape(c, LEAD, x2 => { x2.moveTo(80, -118); x2.lineTo(104, -123); x2.lineTo(86, -106); }, INK, 1);
    shape(c, col === RED ? OCHRE : LEAD, x2 => { x2.moveTo(10, -92); x2.lineTo(36, -86); x2.lineTo(36, -42); x2.lineTo(20, -30); x2.lineTo(6, -44); }, INK, 2);
    line(c, [21, -82, 21, -40], 2, INK);
    c.restore();
  }
  function fallen(c, x, y, s, dir, col) {
    c.save(); c.translate(x, y); c.scale(s * dir, s);
    shape(c, col, x2 => { x2.moveTo(-34, -4); x2.bezierCurveTo(-20, -20, 16, -20, 30, -8); x2.lineTo(30, 0); x2.lineTo(-34, 0); }, INK, 1.5);
    shape(c, LEAD, x2 => { x2.arc(40, -8, 8, 0, 7); }, INK, 1.5);
    line(c, [-34, -4, -70, -2], 7, BLACK); line(c, [-60, -40, 14, -12], 3, INK); c.restore();
  }
  function banner(c, x, y, h, dir, col) {
    line(c, [x, y, x, y - h], 5, INK);
    const t = y - h, w = 92 * dir;
    shape(c, col, x2 => {
      x2.moveTo(x, t + 4); x2.bezierCurveTo(x + w * .4, t - 10, x + w * .7, t + 16, x + w, t + 2);
      x2.lineTo(x + w * .78, t + 26); x2.lineTo(x + w, t + 50); x2.bezierCurveTo(x + w * .7, t + 62, x + w * .4, t + 40, x, t + 56);
    }, INK, 2);
    line(c, [x + w * .12, t + 16, x + w * .62, t + 18], 3, OCHRE); line(c, [x + w * .12, t + 42, x + w * .62, t + 42], 3, OCHRE);
    shape(c, OCHRE, x2 => { x2.moveTo(x - 7, t); x2.lineTo(x, t - 16); x2.lineTo(x + 7, t); });
  }
  function cloud(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(-120, 16); c.bezierCurveTo(-80, -16, -44, 24, -6, 2); c.bezierCurveTo(30, -18, 70, 20, 120, -8); c.stroke();
    for (const [ox, oy, d] of [[-54, 0, 1], [28, -2, -1], [104, -8, 1]]) {
      c.beginPath();
      for (let a = 0; a < 15; a += .35) { const r = 3 + a * 1.55, px = ox + Math.cos(a * d) * r, py = oy - 16 + Math.sin(a * d) * r; a ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.stroke();
    }
    c.restore();
  }
  function fortress(c, x, y) {
    shape(c, '#6f4a2a', k => { k.moveTo(x, y); k.lineTo(x, y - 74); for (let i = 0; i < 18; i++) { const a = x + i * 24; k.lineTo(a, y - 74); k.lineTo(a, y - 88); k.lineTo(a + 13, y - 88); k.lineTo(a + 13, y - 74); } k.lineTo(x + 430, y - 74); k.lineTo(x + 430, y); }, INK, 2.5);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 17; i++) line(c, [x + 6 + i * 25 + r * 11, y - 60 + r * 20, x + 22 + i * 25 + r * 11, y - 60 + r * 20], 1.6, '#3d2717');
    const g = x + 215;
    shape(c, BLACK, k => { k.moveTo(g - 30, y); k.lineTo(g - 30, y - 36); k.quadraticCurveTo(g, y - 62, g + 30, y - 36); k.lineTo(g + 30, y); });
    for (const [w, h, b] of [[108, 34, 88], [76, 30, 136]]) {
      shape(c, RED, k => { k.rect(g - w / 2 + 10, y - b - h, w - 20, h); }, INK, 2);
      shape(c, BLACK, k => { k.moveTo(g - w / 2 - 26, y - b - h + 6); k.quadraticCurveTo(g - w / 3, y - b - h - 4, g - w / 4, y - b - h - 22); k.lineTo(g + w / 4, y - b - h - 22); k.quadraticCurveTo(g + w / 3, y - b - h - 4, g + w / 2 + 26, y - b - h + 6); });
    }
  }
  function warship(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.scale(s, s);
    shape(c, '#4b2e1b', k => { k.moveTo(-120, -30); k.quadraticCurveTo(-92, 6, -60, 8); k.lineTo(82, 8); k.quadraticCurveTo(112, 0, 130, -36); k.lineTo(96, -20); k.lineTo(-92, -20); }, INK, 2);
    shape(c, col, k => { k.rect(-54, -50, 92, 30); }, INK, 2);
    shape(c, BLACK, k => { k.moveTo(-70, -50); k.lineTo(54, -50); k.lineTo(38, -64); k.lineTo(-54, -64); });
    line(c, [-6, -64, -6, -150], 5, INK);
    shape(c, LEAD, k => { k.moveTo(-6, -146); k.quadraticCurveTo(48, -112, 42, -74); k.lineTo(-6, -74); }, INK, 2);
    for (let i = 0; i < 5; i++) line(c, [-58 + i * 30, 6, -74 + i * 30, 26], 3, INK);
    c.restore();
  }
  function waves(c, x, y, w, col) {
    for (let r = 0; r < 3; r++) {
      c.strokeStyle = col; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
      for (let i = 0; i * 34 < w; i++) { const a = x + i * 34 + (r % 2) * 17, b = y + r * 13; c.moveTo(a, b); c.quadraticCurveTo(a + 9, b - 11, a + 18, b - 3); c.quadraticCurveTo(a + 15, b - 2, a + 13, b + 1); }
      c.stroke();
    }
  }
  function mountains(c, r, x0, x1, base, h, col) {
    c.fillStyle = col; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, base);
    let x = x0; const peaks = [];
    while (x < x1) { const w = 52 + r() * 70, t = base - h * (.45 + r() * .55); c.quadraticCurveTo(x + w * .26, t + 16, x + w * .5, t); c.quadraticCurveTo(x + w * .74, t + 16, x + w, base - r() * 10); peaks.push([x + w * .5, t]); x += w; }
    c.lineTo(x, base); c.closePath(); c.fill(); c.stroke();
    for (const [a, b] of peaks) for (let i = 1; i < 4; i++) curve(c, a - i * 7, b + i * 15, a - i * 2, b + i * 19, a + i * 6, b + i * 16, 1.6, INK);
  }
  function border(c, y, h) {
    c.fillStyle = '#3a2013'; c.fillRect(0, y, 1920, h);
    c.fillStyle = OCHRE; c.fillRect(0, y + 5, 1920, 3); c.fillRect(0, y + h - 8, 1920, 3);
    c.strokeStyle = '#c79a4d'; c.lineWidth = 4; c.lineJoin = 'miter'; c.lineCap = 'butt';
    const m = h - 28, top = y + 14;
    for (let x = -10; x < 1930; x += m * 1.5) {
      c.beginPath(); c.moveTo(x, top + m); c.lineTo(x, top); c.lineTo(x + m, top); c.lineTo(x + m, top + m); c.lineTo(x + m * .34, top + m); c.lineTo(x + m * .34, top + m * .36); c.lineTo(x + m * .66, top + m * .36); c.stroke();
    }
  }

  function paintMural(cv) {
    const W = 1920, H = 1080, g = cv.getContext('2d'), r = rng(184);
    // 회벽
    g.fillStyle = '#b4935f'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      const x = r() * W, y = r() * H, a = 50 + r() * 190, gr = g.createRadialGradient(x, y, 0, x, y, a), light = r() > .5;
      gr.addColorStop(0, light ? 'rgba(226,202,152,.16)' : 'rgba(92,60,30,.14)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - a, y - a, a * 2, a * 2);
    }
    // 그림 층
    const fc = document.createElement('canvas'); fc.width = W; fc.height = H; const c = fc.getContext('2d');
    for (const [x, y, s] of [[300, 128, .9], [720, 112, 1.05], [1130, 130, .85], [1560, 108, 1], [90, 214, .7], [980, 216, .7], [1820, 200, .75]]) cloud(c, x, y, s, '#7c4a26');
    mountains(c, r, 420, 1500, 346, 128, '#7b7f5d');
    mountains(c, r, 560, 1360, 362, 76, '#54644f');
    fortress(c, 36, 362);
    banner(c, 96, 276, 62, 1, RED); banner(c, 400, 276, 62, 1, RED);
    waves(c, 1380, 332, 540, '#2c5a50');
    warship(c, 1520, 330, .88, TEAL); warship(c, 1780, 322, .72, RED);
    line(c, [0, 372, W, 372], 5, '#3a2013'); line(c, [0, 380, W, 380], 2, '#3a2013');

    // 뒤쪽 기병과 깃발
    for (const x of [58, 230, 1690, 1858]) banner(c, x, 640, 230, x < 960 ? 1 : -1, x < 960 ? RED : TEAL);
    const backL = { coat: '#6d3c20', cloth: RED, cape: RED, armor: '#59301e', helm: BLACK, skin: LEAD, plume: RED, weapon: 'spear', blade: LEAD, ang: -.32 };
    const backR = { coat: BLACK, cloth: TEAL, cape: TEAL, armor: '#284740', helm: BLACK, skin: LEAD, plume: LEAD, weapon: 'spear', blade: LEAD, ang: -.32 };
    [[130, 640], [370, 628], [560, 660]].forEach(([x, y]) => cavalry(c, x, y, .62, 1, backL));
    [[1790, 640], [1550, 628], [1360, 660]].forEach(([x, y]) => cavalry(c, x, y, .62, -1, backR));
    // 화살
    for (let i = 0; i < 46; i++) {
      const left = i % 2 === 0, x = (left ? 240 : 1680) + (left ? 1 : -1) * r() * 620, y = 410 + r() * 150, d = left ? 1 : -1;
      line(c, [x, y, x + 54 * d, y + 15], 2, INK); line(c, [x + 54 * d, y + 15, x + 44 * d, y + 8], 2, INK); line(c, [x + 54 * d, y + 15, x + 43 * d, y + 16], 2, INK);
    }
    // 땅선
    curve(c, 0, 868, 960, 846, W, 868, 5, '#3a2013');
    for (let i = 0; i < 150; i++) { const x = r() * W, y = 866 + r() * 12; line(c, [x, y, x + 12 + r() * 26, y + r() * 3], 1.5, '#5a3820'); }

    // 측면 주력 기병
    const flankL = { coat: '#7a2f1b', cloth: OCHRE, cape: RED, armor: '#6d2a1a', helm: BLACK, skin: LEAD, plume: OCHRE, weapon: 'ji', blade: LEAD, ang: -.28 };
    const flankR = { coat: LEAD, cloth: TEAL, cape: TEAL, armor: '#26483f', helm: BLACK, skin: LEAD, plume: RED, weapon: 'ji', blade: LEAD, ang: -.28 };
    cavalry(c, 250, 856, .94, 1, flankL); cavalry(c, 1670, 856, .94, -1, flankR);

    // 중앙의 일기토
    cavalry(c, 700, 862, 1.26, 1, { coat: '#8a3a20', cloth: TEAL, cape: '#a23a22', armor: '#2f5a50', helm: '#3a2013', skin: '#c99a68', plume: RED, weapon: 'guan', blade: LEAD, ang: -.36, beard: true });
    cavalry(c, 1220, 862, 1.26, -1, { coat: LEAD, cloth: RED, cape: LEAD, armor: '#70301d', helm: BLACK, skin: LEAD, plume: LEAD, weapon: 'ji', blade: '#efe3c4', ang: -.36 });

    // 전열 보병
    for (let i = 0; i < 12; i++) soldier(c, 28 + i * 66 + r() * 12, 990 + (i % 2) * 9, 1, 1, i % 3 ? RED : '#6d2a1a', r());
    for (let i = 0; i < 12; i++) soldier(c, W - 28 - i * 66 - r() * 12, 990 + (i % 2) * 9, 1, -1, i % 3 ? TEAL : '#26483f', r());
    fallen(c, 900, 948, 1, 1, RED); fallen(c, 1040, 972, 1, -1, TEAL); fallen(c, 960, 1000, .9, 1, TEAL);
    border(c, 0, 62); border(c, 1018, 62);

    // 세월에 벗겨진 안료
    c.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(0,0,0,${.25 + r() * .6})`; const s = .6 + r() * r() * 5; c.fillRect(r() * W, r() * H, s, s * (.5 + r())); }
    for (let i = 0; i < 90; i++) {
      const x = r() * W, y = r() * H, n = 7 + r() * 7 | 0, a = 10 + r() * 46;
      c.fillStyle = `rgba(0,0,0,${.35 + r() * .5})`; c.beginPath();
      for (let k = 0; k < n; k++) { const t = k / n * 6.283, q = a * (.5 + r() * .7); c.lineTo(x + Math.cos(t) * q, y + Math.sin(t) * q * .7); }
      c.closePath(); c.fill();
    }
    c.globalCompositeOperation = 'source-over';
    g.globalAlpha = .94; g.drawImage(fc, 0, 0); g.globalAlpha = 1;

    // 균열
    for (let i = 0; i < 26; i++) {
      let x = r() * W, y = r() * H, a = r() * 6.283; const pts = [x, y], n = 8 + r() * 26 | 0;
      for (let k = 0; k < n; k++) { a += (r() - .5) * 1.1; x += Math.cos(a) * (10 + r() * 22); y += Math.sin(a) * (10 + r() * 22); pts.push(x, y); }
      line(g, pts.map((v, k) => v + (k % 2 ? 1.5 : 1)), 1.3, 'rgba(235,214,170,.3)'); line(g, pts, 1.3, 'rgba(38,22,12,.62)');
    }
    // 입자
    try {
      const im = g.getImageData(0, 0, W, H), d = im.data;
      for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 20; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      g.putImageData(im, 0, 0);
    } catch (e) { /* 입자 없이 진행 */ }
  }

  // ---------- 화면과 연출 ----------
  let root = null, done = false, raf = 0, timers = [], items = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  function glyphSvg(ch, i) {
    const masks = STROKES[ch].map(s => `<path d="${strokePath(s)}" fill="none" stroke="#fff" stroke-width="${s[0]}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    return `<svg class="tGlyph" viewBox="0 0 1000 1000" aria-hidden="true">
      <defs><linearGradient id="tGold${i}" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff0bd"/><stop offset=".46" stop-color="#e8bd5c"/><stop offset=".56" stop-color="#b98331"/><stop offset="1" stop-color="#f1cf7c"/></linearGradient>
      <mask id="tMask${i}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="1120" height="1120">${masks}</mask></defs>
      <g class="tInk" mask="url(#tMask${i})"><path d="${GLYPH[ch]}" fill="url(#tGold${i})" stroke="#170b05" stroke-width="16" paint-order="stroke" stroke-linejoin="round"/></g></svg>`;
  }
  function setStroke(it, p) { it.el.setAttribute('stroke-dashoffset', String((it.len + it.w) * (1 - p))); }
  function revealAll() {
    items.forEach(it => setStroke(it, 1));
    root.querySelectorAll('.tInk').forEach(g => g.removeAttribute('mask'));
  }
  function drum(n) {
    if (typeof bgmTimer === 'undefined' || !bgmTimer || !audioCtx) return;
    for (let i = 0; i < n; i++) { tone(62, i * .24, .42, 'sine', .22); tone(120, i * .24, .1, 'triangle', .06); }
  }
  function finish(instant) {
    if (done || !root) return;
    done = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = [];
    revealAll(); root.classList.add('written');
    const step = instant ? 0 : 1;
    later(() => { root.classList.add('sealed'); drum(1); }, 260 * step);
    later(() => root.classList.add('ready'), 760 * step);
    later(() => { const b = $('tGo'); if (b) b.focus({ preventScroll: true }); }, 900 * step);
  }
  function play() {
    let at = 800, last = null;
    items.forEach(it => {
      if (last !== null && last !== it.ch) at += 170;
      it.at = at; it.dur = 95 + it.len * .2; at += it.dur + 28; last = it.ch;
    });
    const end = at, t0 = performance.now();
    const frame = now2 => {
      const t = now2 - t0;
      items.forEach(it => { if (!it.fin && t >= it.at) { const p = Math.min(1, (t - it.at) / it.dur); setStroke(it, p * p * (3 - 2 * p)); if (p === 1) it.fin = true; } });
      if (t >= end) finish(false); else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }
  function syncSound() { const b = $('tSnd'), s = $('sndBtn'); if (b && s) b.textContent = s.textContent; }
  let muralCache = null;
  function putMural(cv) {
    if (muralCache) { cv.getContext('2d').drawImage(muralCache, 0, 0); return; }
    paintMural(cv); muralCache = cv;
  }
  function closeTitle() {
    if (!root || root.classList.contains('menu')) return;
    done = true; timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf);
    drum(3); root.classList.add('menu'); showStart();
  }
  // 시나리오·세력 선택 화면의 배경: 타이틀 벽화를 그대로 잇는다
  window.showMenuBg = function () {
    $('modal').classList.add('menu');
    if (root) { root.classList.add('menu'); return; }
    try {
      done = true;
      root = document.createElement('div'); root.id = 'title'; root.className = 'menu written sealed ready';
      root.innerHTML = '<canvas id="tMural" width="1920" height="1080" aria-hidden="true"></canvas><div class="tShade"></div>';
      document.body.appendChild(root); document.documentElement.classList.add('titling');
      putMural($('tMural'));
      const el = root; requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
    } catch (e) { /* 벽화 없이도 메뉴는 동작 */ }
  };
  window.hideMenuBg = function () {
    $('modal').classList.remove('menu');
    document.documentElement.classList.remove('titling');
    if (!root) return;
    const el = root; root = null; el.classList.add('leaving');
    setTimeout(() => el.remove(), 800);
  };
  window.showTitle = function () {
    try {
      done = false; items = [];
      root = document.createElement('div'); root.id = 'title';
      let embers = '';
      for (let i = 0; i < 24; i++) embers += `<i style="left:${(i * 41 + 7) % 100}%;animation-delay:${-(i * 1.37 % 11).toFixed(2)}s;animation-duration:${(7 + i * 1.9 % 6).toFixed(1)}s;--dx:${(i * 37 % 90) - 45}px"></i>`;
      root.innerHTML = `<canvas id="tMural" width="1920" height="1080" aria-hidden="true"></canvas><div class="tShade"></div><div class="tFire"></div><div class="tEmbers">${embers}</div>
        <div class="tStage"><h1 class="tChars" aria-label="삼국지">${TITLE_CHARS.map(glyphSvg).join('')}
          <svg class="tSeal" viewBox="0 0 1000 1000" aria-hidden="true"><rect x="30" y="30" width="940" height="940" rx="70" fill="#a3231a" stroke="#e7c489" stroke-width="22"/><rect x="85" y="85" width="830" height="830" rx="36" fill="none" stroke="#f3dfb8" stroke-width="16"/><g fill="#f7e8c8"><path transform="translate(125 95) scale(.75 .41)" d="${GLYPH['天']}"/><path transform="translate(125 500) scale(.75 .41)" d="${GLYPH['下']}"/></g></svg></h1>
          <p class="tName">NATION 3</p><p class="tSub">난세에 일어선 영웅들, 천하를 다투다</p>
          <div class="tBtns"><button id="tGo">천하로 나아가다</button><button id="tSnd"></button></div></div>
        <p class="tHint">화면을 누르면 건너뜁니다</p>`;
      document.body.appendChild(root); document.documentElement.classList.add('titling');
      root.querySelectorAll('.tGlyph').forEach((svg, i) => {
        const ch = TITLE_CHARS[i];
        svg.querySelectorAll('mask path').forEach((el, k) => {
          const len = el.getTotalLength(), w = STROKES[ch][k][0];
          el.setAttribute('stroke-dasharray', `${len} ${len + w * 2 + 400}`);
          const it = { el, len, w, ch }; items.push(it); setStroke(it, 0);
        });
      });
      syncSound();
      root.addEventListener('click', () => finish(true));
      $('tGo').addEventListener('click', e => { e.stopPropagation(); closeTitle(); });
      $('tSnd').addEventListener('click', e => { e.stopPropagation(); toggleSound(); syncSound(); drum(2); });
      const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => setTimeout(() => {
        if (!root) return;
        try { putMural($('tMural')); } catch (e) { /* 벽화 없이도 진행 */ }
        root.classList.add('on');
        if (still) finish(true); else play();
      }, 20));
    } catch (e) {
      if (root) root.remove(); root = null; document.documentElement.classList.remove('titling'); showStart();
    }
  };
})();
