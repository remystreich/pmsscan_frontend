import { useState } from 'react';
import { Button } from '@/components/ui/button';

function Home(): React.JSX.Element {
   const [count, setCount] = useState(0);

   return (
      <>
         <div className="card">
            <Button variant="default" onClick={() => setCount((count) => count + 1)}>
               count is {count}
            </Button>
         </div>
         <p>{count}</p>
      </>
   );
}

export default Home;
