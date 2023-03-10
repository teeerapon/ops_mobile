import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import liff from '@line/liff';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SignUp() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [optionsII, setOptionsII] = React.useState();
  const loading = open && options.length === 0;

  const [idToken, setIdToken] = React.useState();
  const [displayName, setDisplayName] = React.useState();
  const [statusMessage, setStatusMessage] = React.useState();
  const [userId, setUserId] = React.useState();
  const [venderCode, setVenderCode] = React.useState();
  const [name, setName] = React.useState();
  const [lastname, setLastname] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();

  const submitForm = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: 'application/json; charset=utf-8',
      Accept: 'application/json',
    };
    const http = 'http://localhost:32001/api/STrack_Registation';

    const body = {
      userid: userId,
      venderCode: venderCode,
      name: name,
      lastname: lastname,
      phoneNumber: phoneNumber,
    };

    await axios.post(http, body, { headers }).then((res) => {
      if (res.data.messages[0].text === '??????????????????????????????????????????????????????????????????????????????????????????') {
        alert(res.data.messages[0].text);
      } else {
        liff.closeWindow();
      }
    });
  };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const headers = {
          Authorization: 'application/json; charset=utf-8',
          Accept: 'application/json',
        };
        try {
          await axios
            .get('http://localhost:32001/api/OPS_Mobile_List_Vender', {
              headers,
            })
            .then((response) => {
              setOptions(response.data);
            });
        } catch (error) {
          console.log(error);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const logout = () => {
    liff.logout();
    window.location.reload();
  };

  const initLine = () => {
    liff.init(
      { liffId: '1657915988-6Jrbvqly' },
      () => {
        if (liff.isLoggedIn()) {
          runApp();
        } else {
          liff.login();
        }
      },
      (err) => console.error(err)
    );
  };

  const runApp = () => {
    const idToken = liff.getIDToken();
    setIdToken(idToken);
    liff
      .getProfile()
      .then((profile) => {
        setDisplayName(profile.displayName);
        setStatusMessage(profile.statusMessage);
        setUserId(profile.userId);
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    initLine();
  }, []);

  if (!displayName) {
    return (
      <React.Fragment>
        <Box
          sx={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={3}>
            <CircularProgress disableShrink color="inherit" />
            <Typography variant="h4" color="inherit">
              Loading...
            </Typography>
          </Stack>
        </Box>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              ??????????????????????????????????????????????????????
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={submitForm}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    disabled
                    fullWidth
                    size="small"
                    label="Display Name"
                    value={displayName}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="given-name"
                    required
                    fullWidth
                    size="small"
                    label="????????????????????????"
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="?????????????????????"
                    onChange={(event) => setLastname(event.target.value)}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    label="???????????????????????????????????????"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="Email Address"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="asynchronous-demo"
                    fullWidth
                    size="small"
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.VendorID === value.VendorID
                    }
                    getOptionLabel={(option) => option.Vendor_Name}
                    options={options}
                    onChange={(event, newValue) => {
                      setVenderCode(newValue.Vendor_Code);
                    }}
                    loading={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="???????????????????????????????????????????????????"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
