import svgPaths from "./svg-ijtftoose6";

function Time() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[22px] items-center justify-center min-h-px min-w-px pt-[1.5px] relative" data-name="Time">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[#252525] text-[17px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.328 13">
        <g id="Frame">
          <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, #252525)" width="24" x="0.5" y="0.5" />
          <path d={svgPaths.p7a14d80} fill="var(--fill-0, #252525)" id="Cap" opacity="0.4" />
          <rect fill="var(--fill-0, #252525)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="flex-[1_0_0] h-[22px] min-h-px min-w-px relative" data-name="Levels">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[7px] items-center justify-center pr-px pt-px relative size-full">
          <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
              <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, #252525)" fillRule="evenodd" id="Cellular Connection" />
            </svg>
          </div>
          <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
              <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, #252525)" fillRule="evenodd" id="Wifi" />
            </svg>
          </div>
          <Frame />
        </div>
      </div>
    </div>
  );
}

function ClickToRefresh() {
  return (
    <div className="absolute font-['Helvetica:Bold',sans-serif] h-[46px] leading-[22px] left-[18px] not-italic text-[24px] text-black top-[64px] w-[81px] whitespace-nowrap" data-name="click to refresh">
      <p className="absolute left-0 top-0">Design</p>
      <p className="absolute left-0 top-[24px]">info</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute font-['Helvetica:Light',sans-serif] h-[22px] leading-[22px] left-[18px] not-italic text-[12px] text-black top-[317px] w-[284px] whitespace-nowrap">
      <p className="absolute left-0 top-0">All info (43)</p>
      <p className="absolute left-[75px] top-0">Design News</p>
      <p className="absolute left-[161px] top-0">Paper</p>
      <p className="absolute left-[208px] top-0">Design Award</p>
      <p className="absolute left-[66px] top-0">/</p>
      <p className="absolute left-[152px] top-0">/</p>
      <p className="absolute left-[199px] top-0">/</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[302px] left-[17px] top-[357px] w-[367px]">
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[22px] left-0 not-italic text-[24px] text-black top-[232px] whitespace-nowrap">Design News title 1th example</p>
      <p className="absolute font-['Helvetica:Regular',sans-serif] h-[45px] leading-[0] left-px not-italic text-[14px] text-black top-[257px] w-[366px]">
        <span className="leading-[22px]">{`This is an example of a `}</span>
        <span className="font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px]">component</span>
        <span className="leading-[22px]">{` in the main body of a design consultation post.`}</span>
      </p>
      <p className="absolute font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px] left-px text-[#474747] text-[14px] top-[202px] whitespace-nowrap">Design News</p>
      <div className="absolute bg-[#d9d9d9] h-[194px] left-px top-0 w-[366px]" data-name="image" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[302px] left-[17px] top-[685px] w-[367px]">
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[22px] left-0 not-italic text-[24px] text-black top-[232px] whitespace-nowrap">Paper title 1th example</p>
      <p className="absolute font-['Helvetica:Regular',sans-serif] h-[45px] leading-[0] left-px not-italic text-[14px] text-black top-[257px] w-[366px]">
        <span className="leading-[22px]">{`This is an example of a `}</span>
        <span className="font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px]">component</span>
        <span className="leading-[22px]">{` in the main body of a design paper post.`}</span>
      </p>
      <p className="absolute font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px] left-px text-[#474747] text-[14px] top-[202px] whitespace-nowrap">Paper</p>
      <div className="absolute bg-[#d9d9d9] h-[194px] left-px top-0 w-[366px]" data-name="image" />
    </div>
  );
}

function DownC({ className }: { className?: string }) {
  return <div className={className || "absolute left-[219px] size-[17px] top-[91px]"} data-name="Down-c (下-圆)" />;
}

function Frame4() {
  return (
    <div className="absolute h-[206px] left-[18px] top-[89px] w-[366px]">
      <div className="absolute inset-[1.31%_40.63%_91.12%_55.11%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.584 15.584">
          <path d={svgPaths.p1ca88c00} fill="var(--fill-0, #333333)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[22px] left-[224px] not-italic text-[20px] text-black top-0 whitespace-nowrap">Calendar</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-0 not-italic text-[#727272] text-[16px] top-[38px] w-[39px]">Mon</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-[61px] not-italic text-[#727272] text-[16px] top-[38px] w-[34px]">Tue</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-[116px] not-italic text-[#727272] text-[16px] top-[38px] w-[40px]">Wed</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-[177px] not-italic text-[#727272] text-[16px] top-[38px] w-[35px]">Thu</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-[234px] not-italic text-[#727272] text-[16px] top-[38px] w-[23px]">Fri</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-[279px] not-italic text-[#727272] text-[16px] top-[38px] w-[30px]">Sat</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[normal] left-[331px] not-italic text-[#727272] text-[16px] top-[38px] w-[35px]">Sun</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[11px] leading-[normal] left-[345px] not-italic text-[#727272] text-[16px] top-[60px] w-[13px]">3</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[13px] not-italic size-[12px] text-[#727272] text-[16px] top-[91px]">4</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[9px] not-italic text-[#727272] text-[16px] top-[126px] w-[18px]">11</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[8px] not-italic text-[#727272] text-[16px] top-[160px] w-[21px]">18</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[6px] not-italic text-[#727272] text-[16px] top-[194px] w-[23px]">25</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[68px] not-italic size-[12px] text-[#727272] text-[16px] top-[91px]">5</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[64px] not-italic text-[#727272] text-[16px] top-[126px] w-[21px]">12</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[64px] not-italic text-[#727272] text-[16px] top-[160px] w-[21px]">19</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[61px] not-italic text-[#727272] text-[16px] top-[194px] w-[24px]">26</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[124px] not-italic size-[12px] text-[#727272] text-[16px] top-[91px]">6</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[118px] not-italic text-[#727272] text-[16px] top-[126px] w-[21px]">13</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[117px] not-italic text-[#727272] text-[16px] top-[160px] w-[23px]">20</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[117px] not-italic text-[#727272] text-[16px] top-[194px] w-[22px]">27</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[normal] left-[181px] not-italic text-[#727272] text-[16px] top-[91px] w-[9px]">7</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[174px] not-italic text-[#727272] text-[16px] top-[126px] w-[21px]">14</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[175px] not-italic text-[#727272] text-[16px] top-[160px] w-[21px]">21</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[173px] not-italic text-[#727272] text-[16px] top-[194px] w-[23px]">28</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[normal] left-[235px] not-italic text-[16px] text-black top-[91px] w-[10px]">8</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[230px] not-italic text-[#727272] text-[16px] top-[126px] w-[21px]">15</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[228px] not-italic text-[#727272] text-[16px] top-[160px] w-[23px]">22</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[228px] not-italic text-[#727272] text-[16px] top-[194px] w-[23px]">29</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[290px] not-italic text-[#727272] text-[16px] top-[91px] w-[11px]">9</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[290px] not-italic size-[11px] text-[#727272] text-[16px] top-[60px]">2</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[11px] leading-[normal] left-[237px] not-italic text-[#727272] text-[16px] top-[60px] w-[10px]">1</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[285px] not-italic text-[#727272] text-[16px] top-[126px] w-[21px]">16</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[283px] not-italic text-[#727272] text-[16px] top-[160px] w-[23px]">23</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[283px] not-italic text-[#727272] text-[16px] top-[194px] w-[24px]">30</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[341px] not-italic text-[#727272] text-[16px] top-[91px] w-[20px]">10</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[341px] not-italic text-[#727272] text-[16px] top-[126px] w-[19px]">17</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[338px] not-italic text-[#727272] text-[16px] top-[160px] w-[23px]">24</p>
      <div className="absolute left-[239px] size-[3px] top-[110px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[239px] size-[3px] top-[79px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[294px] size-[3px] top-[79px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[349px] size-[3px] top-[79px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[183px] size-[3px] top-[110px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[127px] size-[3px] top-[110px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[71px] size-[3px] top-[110px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
      <div className="absolute left-[15px] size-[3px] top-[110px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, black)" id="Ellipse 1" r="1.5" />
        </svg>
      </div>
    </div>
  );
}

export default function HomeCalendar() {
  return (
    <div className="bg-white relative size-full" data-name="Home-Calendar">
      <div className="absolute content-stretch flex gap-[154px] items-center justify-center left-0 pb-[19px] pt-[21px] px-[24px] right-0 top-0" data-name="Status bar">
        <Time />
        <Levels />
      </div>
      <ClickToRefresh />
      <Frame3 />
      <div className="absolute left-[351px] size-[38px] top-[77px]" data-name="Hamburger-button (汉堡图标)">
        <div className="absolute inset-[20.73%_12.6%_20.94%_12.4%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.5 22.166">
            <path d={svgPaths.p140e1700} fill="var(--fill-0, #333333)" id="Vector" />
          </svg>
        </div>
      </div>
      <Frame1 />
      <Frame2 />
      <DownC />
      <Frame4 />
    </div>
  );
}