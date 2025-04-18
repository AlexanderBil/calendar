import '@mobiscroll/react/dist/css/mobiscroll.min.css';

import {
  Button,
  Datepicker,
  formatDate,
  Input,
  Page,
  Popup,
  setOptions,
  localeUa,
  MbscDateType,
  MbscDatepickerChangeEvent,
  MbscResponsiveOptions,
  MbscPopupOptions,
} from '@mobiscroll/react';
import { useCallback, useEffect, useState } from 'react';

import './Calendar.css'

setOptions({
  locale: localeUa,
  theme: 'ios',
  themeVariant: 'light',
});

const startDate = '2025-04-18T00:00';
const endDate = '2025-04-24T00:00';

function App() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [start, setStart] = useState<Input | null>(null);
  const [end, setEnd] = useState<Input | null>(null);

  const [selectedDate, setSelectedDate] = useState<MbscDateType[]>([
    startDate,
    endDate,
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [disabledInput, setDisabledInput] = useState(false);

  const inputClick = useCallback(() => {
    setOpen(true);
  }, []);

  const changeInputValue = useCallback((start: string, end: string) => {
    const dateFormat = 'DD/MM/YYYY hh:mm';
    setInputValue(
      formatDate(dateFormat, new Date(start)) +
        ' - ' +
        formatDate(dateFormat, new Date(end)),
    );
  }, []);

  const applyClick = useCallback(() => {
    changeInputValue(
      selectedDate[0] as string,
      (selectedDate[1] as string) || (selectedDate[0] as string),
    );
    setOpen(false);
  }, [selectedDate, changeInputValue]);

  const cancelClick = useCallback(() => {
    setOpen(false);
  }, []);

  const onDateChange = useCallback((ev: MbscDatepickerChangeEvent) => {
    setDisabledInput(false);

    setSelectedDate(ev.value as MbscDateType[]);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const respPopup: MbscResponsiveOptions<MbscPopupOptions> = {
    xsmall: {
      display: 'bottom',
      touchUi: true,
      buttons: [
        {
          text: 'Apply',
          handler: () => {
            const date = selectedDate;
            changeInputValue(
              date[0] as string,
              (date[1] as string) || (date[0] as string),
            );
            setOpen(false);
          },
        },
        'cancel',
      ],
    },
    custom: {
      breakpoint: 559,
      buttons: [],
      display: 'anchored',
      anchor: document.querySelector('.date-filter-input') as HTMLInputElement,
      anchorAlign: 'start',
      touchUi: false,
      scrollLock: false,
      showArrow: false,
      maxWidth: 920,
    },
  };

  useEffect(() => {
    changeInputValue(startDate, endDate);
  }, [changeInputValue]);

  return (
    <div className='container'>
          <Page>
      <div className="mbsc-form-group">
        <Input
          inputStyle="box"
          onClick={inputClick}
          defaultValue={inputValue}
        />
      </div>
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        responsive={respPopup}
        cssClass="demo-date-filtering-popup"
      >
        <div className="mbsc-grid mbsc-no-padding">
          <div className="mbsc-row">
            <div className="mbsc-col-sm-4 mbsc-push-sm-8 demo-date-filtering-dates">
              <div className="demo-date-filtering-inputs">
                <Input
                  ref={setStart}
                  disabled={disabledInput}
                  label="Start"
                  labelStyle="stacked"
                  inputStyle="box"
                  className="demo-date-filtering-range-input"
                  placeholder="Please Select..."
                />
                <Input
                  ref={setEnd}
                  disabled={disabledInput}
                  label="End"
                  labelStyle="stacked"
                  inputStyle="box"
                  className="demo-date-filtering-range-input"
                  placeholder="Please Select..."
                />
              </div>
              <div className="demo-date-filtering-desktop-buttons mbsc-button-group-justified">
                <Button className="apply-button" onClick={applyClick}>
                  Apply
                </Button>
                <Button className="cancel-button" onClick={cancelClick}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className="mbsc-col-sm-8 mbsc-pull-sm-4">
              <Datepicker
                select="range"
                display="inline"
                pages="auto"
                startInput={start}
                endInput={end}
                returnFormat="iso8601"
                showOnClick={false}
                showOnFocus={false}
                value={selectedDate}
                onChange={onDateChange}
                controls={['calendar', 'time']}
              />
            </div>
          </div>
        </div>
      </Popup>
    </Page>
    </div>
  );
}

export default App;
