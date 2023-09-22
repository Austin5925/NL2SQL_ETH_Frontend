import { Link, useNavigate } from 'react-router-dom';

type IllustrationProps = {
  onClose: () => void;
};


export default function Illustration() {
  let navigate = useNavigate();
  return (
    <div className="flex justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full z-50">
      <div className="bg-white w-3/5 p-5 rounded-md">
        <ul className="mb-3 text-center">
          目前的以太坊交易信息数据库表结构如下：
          <li>`Index`：int(11)</li>
          <li>`TxHash`：varchar(64)</li>
          <li>`Status`：int(11)</li>
          <li>`Block`：int(11)</li>
          <li>`Timestamp`：datetime</li>
          <li>`From`：varchar(42)</li>
          <li>`To`：varchar(42)</li>
          <li>`Value`：decimal(38,0)</li>
          <li>`ValueUSD`：double</li>
          <li>`GasFee`：decimal(38,0)</li>
          <li>`GasPrice`：decimal(38,0)</li>
          <li>`InputHex`：text</li>
          <li>`isERC20`：int(11)</li>
          <li>`TokenSymbol`：varchar(32)</li>
        </ul>
        <p className="mb-3 text-center">
          您可以阅读此表，提高提问效率。您也可以自己修改Prompt来自定义您的NL2SQL，系统将根据新的Prompt来进行回复。
        </p>
        <div className="flex justify-center">
          <button
            id="prompt-cancel"
            onClick={() => {
              navigate('/');
            }}
            className="w-30 px-10 py-2 m-3 bg-red-500 text-white rounded-md"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}