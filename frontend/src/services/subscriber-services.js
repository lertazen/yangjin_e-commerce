//desc        Send fetch request to create new subscriber
//route       POST /api/subscriber
//body        {email: inputEmail}
//return      new email
//@access     public
const createNewSubscriber = async (inputEmail) => {
  try {
    const response = await fetch('/api/subscriber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: inputEmail }),
    });
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Response is not ok from creating subscriber');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { createNewSubscriber };
