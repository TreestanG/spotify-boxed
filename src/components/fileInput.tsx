import React, { useState } from 'react';

export default function FileInput({
    setFile,
    fileName
}: { fileName: File, setFile: (e: any) => void }): JSX.Element {

    return (
        <div className="flex items-center gap-4 mt-4 w-full text-center">
            <input
                type="file"
                id="file"
                onChange={(e: any) => {
                    setFile(e.target.files[0]);
                }}
                className="file-input"
                style={{ display: 'none' }} // Hide the default input
            />
            <label htmlFor="file" className="file-input-label border-2 border-gray-400 p-2 rounded-lg text-spotify-text cursor-pointer w-full">
                Choose a file
            </label>
            {fileName && (
                <div className="file-name mt-2 text-spotify-text w-1/2" style={{ color: '#1DB954' }}> {/* Change text color here */}
                    Selected file: {fileName.name}
                </div>
            )}
        </div>
    );
};